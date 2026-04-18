# MRCB AWS Migration Plan

## Context
Both MRCB apps (customer PWA + staff CRM) currently run on Vercel + Supabase. The team has AWS startup credits that cover all costs. Migrating to AWS eliminates future Vercel/Supabase billing and consolidates infrastructure under one provider. Auth has never been implemented — so we build it fresh on AWS Cognito rather than porting from Supabase.

## Architecture Decision
**Amplify Hosting + Standalone AWS Services** (not full Amplify Gen 2 backend)

- Amplify Gen 2's data layer defaults to DynamoDB + AppSync — wrong fit for MRCB's relational schema (8 tables, JOINs, upserts, foreign keys)
- Use Amplify only for hosting (Next.js SSR, git-push deploys)
- Use standalone RDS PostgreSQL, Cognito, and S3 for the backend

---

## Phase 0: AWS Infrastructure (No Code Changes)
Both apps stay on Vercel + Supabase. Zero risk.

| Resource | Config | Cost |
|----------|--------|------|
| RDS PostgreSQL 16 | db.t4g.micro, 20GB gp3, ap-south-1 | ~$13/mo |
| S3 bucket `mrcb-kyc-documents` | Private, SSE-S3, ap-south-1 | <$1/mo |
| Cognito Customer Pool | Phone OTP via SNS, no password | Free (50K MAU) |
| Cognito Staff Pool | Email + password, optional TOTP | Free |
| Amplify Apps (2) | Connect GitHub repos, don't deploy yet | Free tier |

**Tasks:**
1. Create RDS instance, run adapted `schema.sql` (replace `auth.users` refs with plain UUID), run `seed.sql`
2. Create S3 bucket with presigned-URL-only access
3. Create 2 Cognito user pools with app clients
4. Connect both GitHub repos to Amplify (hosting config only)
5. **Start DLT registration for SMS in India** (takes 1-2 weeks, needed for OTP)

**Verify:** psql connects to RDS with seed data, S3 upload/download works, Cognito pools visible, Amplify apps created

---

## Phase 1: Create API Layer (2-3 days)
Add Next.js API routes that talk to RDS + S3. UI still hits Supabase.

**New dependencies (both repos):** `pg`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

**New files — mayyanad-bank:**
- `src/lib/db.ts` — pg Pool with `DATABASE_URL`
- `src/lib/s3.ts` — S3 upload/download/presign helpers
- `src/app/api/applications/route.ts` — POST: insert customer → application → documents → activity_log
- `src/app/api/upload/route.ts` — GET: return presigned PUT URL for S3

**New files — mrcb-crm:**
- `src/lib/db.ts` — pg Pool
- `src/lib/s3.ts` — S3 presign helpers
- `src/app/api/applications/route.ts` — GET: list applications with customer JOIN
- `src/app/api/applications/[id]/route.ts` — GET: detail + PATCH: status update
- `src/app/api/applications/[id]/checks/route.ts` — PUT: upsert verification checks
- `src/app/api/applications/[id]/notes/route.ts` — GET + POST: notes CRUD
- `src/app/api/documents/route.ts` — GET: presigned S3 URL for KYC docs

**Verify:** curl/Postman each endpoint, confirm data flows to RDS and S3

---

## Phase 2: Switch UI to API Routes (1-2 days)
The critical cutover. Rewire frontend to call API routes instead of Supabase.

**mayyanad-bank — `src/app/accounts/savings/page.tsx`:**
- Rewrite `handleSubmit` (~90 lines, currently lines 59-163)
- Upload files via presigned URLs, then POST form data to `/api/applications`

**mrcb-crm — `src/app/applications/page.tsx`:**
- Replace `supabase.from("applications").select(...)` with `fetch("/api/applications")`

**mrcb-crm — `src/app/applications/[id]/page.tsx`:**
- Replace all 5 Supabase calls with fetch to API routes

**Cleanup in both repos:**
- Delete `src/lib/supabase.ts`
- Remove `@supabase/ssr` and `@supabase/supabase-js` from package.json
- Remove Supabase env vars

**Data migration:** Download KYC files from Supabase Storage → upload to S3 (tiny volume, manual is fine)

**Verify:** Full end-to-end — submit application on PWA, view it in CRM, check documents, update status
**Rollback:** Git revert to Supabase versions. Supabase still running.

---

## Phase 3: Deploy to Amplify (0.5 day)
Move hosting from Vercel to Amplify.

1. Create `amplify.yml` in both repos (build: `npm ci && npm run build`)
2. Set env vars in Amplify console (`DATABASE_URL`, `AWS_REGION`, `S3_BUCKET_NAME`)
3. Trigger builds, verify on Amplify URLs
4. Update DNS / share new URLs
5. Remove Vercel projects and `.vercel/` dirs

**Verify:** Both apps work on Amplify URLs, SSR renders correctly
**Rollback:** Re-link Vercel in minutes

---

## Phase 4: Implement Auth with Cognito (3-4 days)
First time auth is implemented in either app.

**PWA Customer Auth (Phone OTP):**
- `src/lib/auth.ts` — Cognito config + helpers
- `src/app/page.tsx` — Wire `handleSendOtp` (line 45) to Cognito `signIn`, `handleVerify` (line 76) to `confirmSignIn`
- `src/middleware.ts` — Protect routes, redirect to `/` if no session
- Install `amazon-cognito-identity-js`

**CRM Staff Auth (Email/Password):**
- `src/app/login/page.tsx` — New login page
- `src/lib/auth.ts` — Staff Cognito config
- `src/middleware.ts` — Protect all routes except `/login`
- Role-based UI: clerk (view/update), manager (approve/reject), admin (full)

**API Route Auth:**
- Add JWT verification to all API routes using `aws-jwt-verify`
- Extract user identity from token, inject into DB queries

**Verify:** Real SMS OTP on PWA, email/password on CRM, 401 on unauthenticated API calls
**Rollback:** Disable middleware to return to unauthenticated state

---

## Phase 5: Cleanup & Hardening (1 day)
1. Decommission Supabase project
2. RDS: Disable public access, move to private subnet, enable backups
3. S3: Lifecycle policy (IA after 1 year), access logging
4. CloudWatch alarms: RDS CPU, storage, Lambda errors
5. Remove `supabase/` SQL files from repos (or archive)

---

## Total Cost Estimate: ~$19/month
| Service | Cost |
|---------|------|
| RDS db.t4g.micro | ~$13 |
| S3 < 1GB | <$1 |
| Amplify (2 apps) | $0 (free tier) |
| Cognito < 50K MAU | $0 (free tier) |
| SNS SMS (~500 OTPs/mo) | ~$5 |
| **Total** | **~$19/mo** (covered by startup credits) |

## Timeline: ~8-11 days total

## Key Risk: Indian SMS Regulations
India requires DLT registration for transactional SMS. Start this in Phase 0 — it takes 1-2 weeks. Without it, Cognito OTP SMS won't be delivered.

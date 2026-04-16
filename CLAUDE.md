@AGENTS.md

# MRCB Staff CRM — Internal Banking Portal

## Overview
Desktop-first internal CRM for **Mayyanad Regional Co-operative Bank (MRCB)** staff. Used by branch clerks, branch managers, and head office admins to process account applications, manage customers, handle loan leads, run credit checks, and view reports. This CRM receives and processes applications submitted through the customer-facing PWA.

## Live URLs
- **Production:** https://mrcb-crm.vercel.app
- **GitHub:** https://github.com/bijin-thfs/mrcb-crm
- **Vercel project:** bijins-projects/mrcb-crm
- **Auto-deploy:** Pushing to `main` triggers production deploy on Vercel.

## Companion App
This CRM shares a **Supabase backend** with the customer PWA:
- **PWA repo:** https://github.com/bijin-thfs/mayyanad-bank
- **PWA live:** https://mayyanad-bank-bijins-projects.vercel.app
- The PWA writes applications → the CRM reads and processes them.
- Same Supabase project, same database, same tables.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Material Symbols Outlined icons
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Language:** TypeScript

## Supabase Backend (Shared)
- **Project URL:** `https://ipydxexifkxyldcgjroo.supabase.co`
- **Client:** `src/lib/supabase.ts` (uses `@supabase/ssr` `createBrowserClient`)
- **Env vars:** `.env.local` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) — also set in Vercel env vars
- **Schema source of truth:** `supabase/schema.sql` in this repo

### Database Tables
| Table | Purpose |
|-------|---------|
| `branches` | Bank branches (Mayyanad Main, Kollam West, Paravur East) |
| `staff` | Bank employees linked to auth.users (role: clerk/manager/admin) |
| `customers` | All bank customers with KYC info, linked to auth.users for PWA users |
| `applications` | Account opening applications (core table — PWA inserts, CRM processes) |
| `application_documents` | Uploaded KYC docs (Aadhaar, PAN, photo) stored in Supabase Storage |
| `accounts` | Created after application approval (savings/current/fd/rd) |
| `verification_checks` | Per-application staff checklist (6 checks: aadhaar, pan, photo, address, vkyc, deposit) |
| `notes` | Internal staff notes on applications/customers |
| `activity_log` | Audit trail (application_submitted, kyc_verified, account_created, etc.) |

### Key Indexes
- `applications(status)`, `applications(assigned_to)`, `applications(submitted_at DESC)`
- `customers(mobile)`, `customers(aadhaar_number)`, `customers(auth_user_id)`
- `accounts(customer_id)`
- `activity_log(entity_type, entity_id)`, `activity_log(created_at DESC)`

### RLS Policies
- Staff can SELECT/UPDATE all data
- Customers can only access their own records
- Applications: anyone authenticated can INSERT (PWA submissions)
- All tables have RLS enabled

### Seed Data
- 3 branches, 4 customers, 4 applications (various statuses), activity log entries

## User Roles
1. **Branch Clerk** — processes applications, updates customer records, daily operations
2. **Branch Manager** — approves/rejects applications, branch reports, staff management
3. **Head Office Admin** — multi-branch oversight, system config, regulatory reports

## Project Structure
```
src/
├── app/
│   ├── page.tsx                          # Dashboard (stats, weekly chart, activity feed)
│   ├── layout.tsx                        # Root layout with Sidebar + TopBar
│   ├── globals.css                       # Shared design system tokens
│   ├── applications/
│   │   └── page.tsx                      # Account Applications queue (LIVE Supabase data)
│   ├── loans/
│   │   └── page.tsx                      # Loan Applications queue (mock data)
│   ├── creditscore/
│   │   └── page.tsx                      # Credit Check inquiry form + guidelines
│   └── settings/
│       └── page.tsx                      # Staff profile, notifications, security
├── components/
│   ├── Sidebar.tsx                       # Fixed left sidebar navigation
│   └── TopBar.tsx                        # Top header with search, notifications, avatar
├── lib/
│   └── supabase.ts                      # Supabase browser client
supabase/
└── schema.sql                           # Full database schema (source of truth)
```

## Pages

### Dashboard (`/`)
- **Stats row:** Approval Rate (94.2%), Pending (08), Total Value (₹12.4M), Disbursements (₹3.2M)
- **Weekly Volume Distribution:** Stacked bar chart (Accounts/Loans/Others by day)
- **Recent Activity:** Timeline feed with status icons
- **Bottom cards:** Pending Signatures, Today's Appointments, Staff Milestone
- Quick actions: Member Lookup, KYC Update, Urgent Reviews
- Currently uses mock data

### Account Applications (`/applications`)
- **LIVE DATA from Supabase** — fetches from `applications` joined with `customers`
- Filter tabs: All / New / Reviewing / VKYC Pending / Successful / Rejected
- Stats: Total Applications, Review Pending, Success Rate (calculated), Today's Leads
- Table: avatar initials, name, email, account type badge, source, status dot, date, Review button
- Search by name, email, or reference number
- Pagination UI
- Empty state with bilingual message

### Loan Applications (`/loans`)
- Two hero stat cards: Total Active Leads (navy) + Pending Approvals (gold)
- Manual Entries Queue table: applicant, branch, proposed amount (₹), CIBIL score (color-coded), Review button
- Search + Export PDF + Status filter
- CIBIL score badges: green (750+), gold (700-749), amber (650-699), red (<650)
- Currently uses mock data (6 sample leads)

### Credit Check (`/creditscore`)
- Breadcrumb navigation
- Inquiry form: Full Name, DOB, PAN, Mobile (+91)
- "Check Credit Score" button (simulates API, shows animated score result with progress bar)
- Staff Guidelines sidebar: Identity Verification + Legal Compliance rules (English + Malayalam)
- Need Assistance card
- Recent Branch Inquiries: 4 cards with score badges + Monthly Quota tracker
- ₹250 verification fee note

### Settings (`/settings`)
- Profile Information: avatar, name, designation, staff ID, email
- Notification Controls: Loan Application Alerts, System Compliance Updates, Security Breach Attempts (toggles)
- Branch Info: location, phone, email, branch code
- Security Settings: Two-Factor Auth toggle, Password Last Changed, Session Management
- Password expiry warning (Malayalam + English)
- Security footer with last login info

## Layout Components

### Sidebar (`src/components/Sidebar.tsx`)
- Fixed left, navy (`bg-primary`) background
- Logo + staff profile card at top
- Nav items: Dashboard, Account Applications (with badge count), Loan Applications, Credit Check, Settings
- "New Application" gold button at bottom
- Collapses to icons only at `< lg` breakpoint
- Active state: white background tint + filled icon

### TopBar (`src/components/TopBar.tsx`)
- Sticky top, glass-effect background
- Search input (accounts, members, loan IDs)
- Notification bell with red dot
- Help button
- "Mayyanad Bank CRM" verified badge
- User avatar

## Design System — "Modern Heritage" (shared with PWA)
Defined in `src/app/globals.css` using `@theme inline`.

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | #001833 | Sidebar, headers, text |
| `primary-container` | #002D56 | Active states, stat cards |
| `secondary` | #775A19 | Gold accents, badges, CTAs |
| `secondary-container` | #FED488 | Tags, highlights, gold cards |
| `surface` | #F8F9FA | Page background |
| `surface-container-lowest` | #FFFFFF | Card backgrounds |
| `surface-container-high` | #E7E8E9 | Input fields, table headers |
| `error` | #BA1A1A | Errors, rejected status |
| `success` | #1B7A3D | Approved status, verified |
| `warning` | #F59E0B | Pending, needs attention |

### Typography
- **Headlines:** Manrope (`font-headline`) — extrabold for titles, bold for section headers
- **Body:** Inter (`font-body`) — medium for content, regular for descriptions

### Custom Classes
- `.heritage-gradient` — linear-gradient(135deg, #001833, #002d56) for navy cards/buttons
- `.malayalam-text` — 110% font-size, 1.6 line-height for Malayalam script

### Design Patterns
- Cards: `bg-surface-container-lowest rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,45,86,0.04)]`
- Status badges: small rounded pills with tinted backgrounds
- Table rows: hover state with `bg-surface-container-low/50`
- Inputs: filled style, no border, gold ghost border on focus
- No 1px borders — use background color shifts

## Data Flow: PWA → CRM
1. Customer fills out account opening form on PWA
2. PWA inserts into `applications` table + uploads docs to `application_documents`
3. CRM `/applications` page fetches and displays all applications
4. Staff reviews, runs verification checklist, adds notes
5. Staff approves → creates entry in `accounts` table
6. Activity logged to `activity_log` throughout

## What Needs Building Next
- [ ] Application detail/review page (`/applications/[id]`) with verification checklist + approve/reject
- [ ] Customer list page (`/customers`)
- [ ] Customer 360° profile page (`/customers/[id]`)
- [ ] Wire dashboard stats to live Supabase data
- [ ] Wire loan applications to Supabase (currently mock data)
- [ ] Supabase Auth integration (staff login, role-based access)
- [ ] Supabase Storage integration for KYC document viewing
- [ ] Notifications system (real-time with Supabase Realtime)
- [ ] Reports & Analytics page
- [ ] Connect PWA savings form to actually insert into Supabase

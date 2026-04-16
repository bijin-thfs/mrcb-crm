-- ═══════════════════════════════════════════════════
-- MRCB Bank — Unified Database Schema
-- Shared between customer PWA and staff CRM
-- ═══════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── BRANCHES ────────────────────────────────────
create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text unique not null,
  address text,
  phone text,
  manager_name text,
  created_at timestamptz default now()
);

alter table public.branches enable row level security;

-- ─── STAFF ───────────────────────────────────────
create table public.staff (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  role text not null check (role in ('clerk', 'manager', 'admin')),
  branch_id uuid references public.branches(id),
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.staff enable row level security;

-- ─── CUSTOMERS ───────────────────────────────────
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id),
  full_name text not null,
  name_malayalam text,
  date_of_birth date,
  gender text,
  father_spouse_name text,
  mobile text unique not null,
  email text,
  occupation text,
  annual_income text,
  address_line1 text,
  address_line2 text,
  city text,
  district text,
  state text default 'Kerala',
  pincode text,
  aadhaar_number text,
  pan_number text,
  is_cooperative_member boolean default false,
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'expired')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.customers enable row level security;

-- ─── APPLICATIONS ────────────────────────────────
create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  reference_number text unique not null,
  customer_id uuid references public.customers(id),
  account_type text not null check (account_type in ('savings', 'current', 'fd', 'rd')),
  status text default 'new' check (status in ('new', 'reviewing', 'vkyc_pending', 'docs_missing', 'approved', 'rejected')),
  source text default 'online_portal' check (source in ('online_portal', 'manual_entry')),
  account_variant text check (account_variant in ('regular', 'zero-balance')),
  cheque_book boolean default false,
  initial_deposit numeric default 0,
  nominee_name text,
  nominee_relationship text,
  vkyc_status text default 'not_started' check (vkyc_status in ('not_started', 'scheduled', 'completed')),
  assigned_to uuid references public.staff(id),
  submitted_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.staff(id),
  rejection_reason text,
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

-- ─── APPLICATION DOCUMENTS ───────────────────────
create table public.application_documents (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references public.applications(id) on delete cascade,
  doc_type text not null check (doc_type in ('photo', 'aadhaar', 'pan')),
  file_path text not null,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.application_documents enable row level security;

-- ─── ACCOUNTS ────────────────────────────────────
create table public.accounts (
  id uuid primary key default uuid_generate_v4(),
  account_number text unique not null,
  customer_id uuid not null references public.customers(id),
  application_id uuid references public.applications(id),
  account_type text not null check (account_type in ('savings', 'current', 'fd', 'rd')),
  status text default 'active' check (status in ('active', 'dormant', 'closed')),
  balance numeric default 0,
  opened_at timestamptz default now(),
  branch_id uuid references public.branches(id)
);

alter table public.accounts enable row level security;

-- ─── VERIFICATION CHECKS ─────────────────────────
create table public.verification_checks (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid not null references public.applications(id) on delete cascade,
  check_type text not null check (check_type in ('aadhaar', 'pan', 'photo', 'address', 'vkyc', 'deposit')),
  checked boolean default false,
  checked_by uuid references public.staff(id),
  checked_at timestamptz,
  unique (application_id, check_type)
);

alter table public.verification_checks enable row level security;

-- ─── NOTES ───────────────────────────────────────
create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references public.applications(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  staff_id uuid not null references public.staff(id),
  content text not null,
  created_at timestamptz default now()
);

alter table public.notes enable row level security;

-- ─── ACTIVITY LOG ────────────────────────────────
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  entity_type text not null check (entity_type in ('application', 'customer', 'account', 'staff')),
  entity_id uuid not null,
  staff_id uuid references public.staff(id),
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.activity_log enable row level security;

-- ═══════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════

create index idx_applications_status on public.applications(status);
create index idx_applications_assigned_to on public.applications(assigned_to);
create index idx_applications_submitted_at on public.applications(submitted_at desc);
create index idx_applications_account_type on public.applications(account_type);
create index idx_customers_mobile on public.customers(mobile);
create index idx_customers_aadhaar on public.customers(aadhaar_number);
create index idx_customers_auth_user on public.customers(auth_user_id);
create index idx_accounts_customer on public.accounts(customer_id);
create index idx_activity_entity on public.activity_log(entity_type, entity_id);
create index idx_activity_created on public.activity_log(created_at desc);
create index idx_notes_application on public.notes(application_id);
create index idx_notes_customer on public.notes(customer_id);
create index idx_app_docs_application on public.application_documents(application_id);

-- ═══════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════

-- Branches: readable by all authenticated users
create policy "Branches are viewable by authenticated users"
  on public.branches for select
  to authenticated
  using (true);

-- Staff: viewable by authenticated users, manageable by admins
create policy "Staff viewable by authenticated"
  on public.staff for select
  to authenticated
  using (true);

-- Customers: staff can view all, customers can view own
create policy "Staff can view all customers"
  on public.customers for select
  to authenticated
  using (
    exists (select 1 from public.staff where id = auth.uid())
    or auth_user_id = auth.uid()
  );

create policy "Staff can update customers"
  on public.customers for update
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

create policy "Customers can insert own record"
  on public.customers for insert
  to authenticated
  with check (auth_user_id = auth.uid());

-- Applications: staff can view/update all, customers can insert
create policy "Staff can view all applications"
  on public.applications for select
  to authenticated
  using (
    exists (select 1 from public.staff where id = auth.uid())
    or customer_id in (select id from public.customers where auth_user_id = auth.uid())
  );

create policy "Staff can update applications"
  on public.applications for update
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

create policy "Authenticated users can insert applications"
  on public.applications for insert
  to authenticated
  with check (true);

-- Application Documents: same as applications
create policy "Staff can view all docs"
  on public.application_documents for select
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

create policy "Authenticated can insert docs"
  on public.application_documents for insert
  to authenticated
  with check (true);

-- Accounts: staff view all, customers view own
create policy "Staff can view all accounts"
  on public.accounts for select
  to authenticated
  using (
    exists (select 1 from public.staff where id = auth.uid())
    or customer_id in (select id from public.customers where auth_user_id = auth.uid())
  );

-- Verification Checks: staff only
create policy "Staff can manage verification checks"
  on public.verification_checks for all
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

-- Notes: staff only
create policy "Staff can manage notes"
  on public.notes for all
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

-- Activity Log: staff can view, system can insert
create policy "Staff can view activity log"
  on public.activity_log for select
  to authenticated
  using (exists (select 1 from public.staff where id = auth.uid()));

create policy "Authenticated can insert activity"
  on public.activity_log for insert
  to authenticated
  with check (true);

-- ═══════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════

-- Default branch
insert into public.branches (name, code, address, phone, manager_name) values
  ('Mayyanad Main Branch', 'MRCB-001', 'Mayyanad, Kollam, Kerala', '0474-2555265', 'Branch Manager'),
  ('Kollam West Branch', 'MRCB-002', 'Kollam West, Kerala', '0474-2557350', 'Branch Manager'),
  ('Paravur East Branch', 'MRCB-003', 'Paravur, Kollam, Kerala', '0474-2512345', 'Branch Manager');

-- Sample customers
insert into public.customers (full_name, name_malayalam, date_of_birth, gender, father_spouse_name, mobile, email, occupation, annual_income, address_line1, city, district, state, pincode, aadhaar_number, pan_number, kyc_status) values
  ('Rahul Janardhanan', 'രാഹുൽ ജനാർദ്ദനൻ', '1990-05-15', 'male', 'Janardhanan K.', '9876543210', 'rahul.j@example.com', 'salaried', '5l-10l', '12/A Lakeside Road', 'Mayyanad', 'Kollam', 'Kerala', '691302', '9876 5432 1098', 'ABCDE1234F', 'verified'),
  ('Sreelekshmi V.', 'ശ്രീലക്ഷ്മി വി.', '1985-11-22', 'female', 'Vijayan P.', '9876543211', 'sv_22@example.com', 'self-employed', '1l-5l', '45 Temple Street', 'Kollam', 'Kollam', 'Kerala', '691001', '8765 4321 0987', 'BCDEF2345G', 'verified'),
  ('Kiran Kumar M.', 'കിരൺ കുമാർ എം.', '1992-03-08', 'male', 'Mohan Kumar', '9876543212', 'kiran.m@example.com', 'business', '5l-10l', '78 Market Road', 'Paravur', 'Kollam', 'Kerala', '691301', '7654 3210 9876', 'CDEFG3456H', 'pending'),
  ('Anjali Das', 'അഞ്ജലി ദാസ്', '1988-07-30', 'female', 'Das P.K.', '9876543213', 'anjali.das@example.com', 'salaried', '1l-5l', '23 Beach Road', 'Mayyanad', 'Kollam', 'Kerala', '691302', '6543 2109 8765', 'DEFGH4567I', 'verified');

-- Sample applications
insert into public.applications (reference_number, customer_id, account_type, status, source, account_variant, cheque_book, initial_deposit, vkyc_status, submitted_at) values
  ('MRCB-20240001', (select id from public.customers where mobile = '9876543210'), 'savings', 'reviewing', 'online_portal', 'regular', true, 5000, 'completed', now() - interval '2 days'),
  ('MRCB-20240002', (select id from public.customers where mobile = '9876543211'), 'current', 'approved', 'manual_entry', 'regular', true, 10000, 'completed', now() - interval '5 days'),
  ('MRCB-20240003', (select id from public.customers where mobile = '9876543212'), 'savings', 'new', 'online_portal', 'zero-balance', false, 0, 'not_started', now() - interval '1 day'),
  ('MRCB-20240004', (select id from public.customers where mobile = '9876543213'), 'fd', 'vkyc_pending', 'online_portal', 'regular', false, 50000, 'scheduled', now() - interval '3 days');

-- Sample activity log
insert into public.activity_log (action, entity_type, entity_id, details) values
  ('application_submitted', 'application', (select id from public.applications where reference_number = 'MRCB-20240001'), '{"customer_name": "Rahul Janardhanan", "account_type": "savings"}'::jsonb),
  ('application_submitted', 'application', (select id from public.applications where reference_number = 'MRCB-20240003'), '{"customer_name": "Kiran Kumar M.", "account_type": "savings"}'::jsonb),
  ('kyc_verified', 'customer', (select id from public.customers where mobile = '9876543210'), '{"staff_name": "Elite Concierge", "doc_type": "aadhaar"}'::jsonb),
  ('application_approved', 'application', (select id from public.applications where reference_number = 'MRCB-20240002'), '{"customer_name": "Sreelekshmi V.", "account_type": "current"}'::jsonb);

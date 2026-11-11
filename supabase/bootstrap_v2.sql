-- Electricidad Lakuntza — bootstrap candidate for a NEW, EMPTY Supabase project.
-- Not executed. Review on the actual project, run once, then validate RLS and Storage.
-- Public invoice intake uses a service-role key ONLY inside the Next.js server action.
-- Never expose that key in NEXT_PUBLIC_* or provide anon write access.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_review_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  locality text,
  supply_type text not null check (supply_type in ('luz', 'gas', 'luz_gas')),
  customer_type text not null check (customer_type in ('vivienda', 'negocio', 'comunidad')),
  bonus_status text not null default 'no_lo_se' check (bonus_status in ('si', 'no', 'no_lo_se')),
  current_company text,
  notes text,
  consent_accepted boolean not null check (consent_accepted = true),
  user_agent text,
  file_path text not null,
  file_name text not null,
  file_type text not null check (file_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  file_size bigint not null check (file_size > 0 and file_size <= 10485760),
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'contacted', 'converted', 'discarded')),
  admin_notes text,
  contacted_at timestamptz,
  converted_at timestamptz,
  precheck_result text not null default 'manual_review',
  analysis_result text not null default 'pending'
    check (analysis_result in ('pending', 'viable', 'review', 'not_viable')),
  analysis_reasons text[] not null default '{}',
  extracted_cups text,
  extracted_tariff text,
  contracted_power_kw numeric,
  consumption_kwh numeric,
  invoice_total_eur numeric,
  billing_days integer,
  has_extra_services boolean not null default false,
  ocr_status text not null default 'pending'
    check (ocr_status in ('pending', 'processing', 'succeeded', 'failed', 'not_applicable')),
  ocr_confidence_avg numeric,
  ocr_requires_manual_review boolean not null default true,
  ocr_processed_at timestamptz
);

create table if not exists public.invoice_ocr_results (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.invoice_review_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  provider text not null,
  source_file_path text,
  ocr_status text not null default 'processing',
  raw_text text,
  extracted_json jsonb not null default '{}'::jsonb,
  confidence_avg numeric,
  requires_manual_review boolean not null default true,
  error_message text,
  processed_at timestamptz
);

create table if not exists public.invoice_lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.invoice_review_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text,
  category text not null,
  location text,
  year integer,
  description text not null,
  long_description text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  public_url text not null,
  storage_path text,
  alt text,
  sort_order integer not null default 100,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists invoice_review_leads_status_created_idx on public.invoice_review_leads (status, created_at desc);
create index if not exists invoice_review_leads_created_idx on public.invoice_review_leads (created_at desc);
create index if not exists invoice_ocr_results_lead_created_idx on public.invoice_ocr_results (lead_id, created_at desc);
create index if not exists invoice_lead_events_lead_created_idx on public.invoice_lead_events (lead_id, created_at desc);
create index if not exists projects_published_featured_idx on public.projects (published, featured, sort_order, created_at desc);
create index if not exists project_images_project_sort_idx on public.project_images (project_id, sort_order);

alter table public.admin_users enable row level security;
alter table public.invoice_review_leads enable row level security;
alter table public.invoice_ocr_results enable row level security;
alter table public.invoice_lead_events enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- The new project disables automatic Data API grants. Give only the necessary roles
-- database access; RLS still decides which rows authenticated users may reach.
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.admin_users,
  public.invoice_review_leads, public.invoice_ocr_results,
  public.invoice_lead_events, public.projects, public.project_images to service_role;

-- Close access to the automatic RLS event-trigger helper from the public Data API.
-- This function is owned by Supabase and is only needed by the database event trigger.
do $harden$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $harden$;

-- No unauthenticated access to customer data (service-role backend bypasses RLS).
revoke all on public.admin_users, public.invoice_review_leads,
  public.invoice_ocr_results, public.invoice_lead_events from anon;
grant select, insert, update, delete on public.invoice_review_leads,
  public.invoice_ocr_results, public.invoice_lead_events to authenticated;
grant select on public.admin_users to authenticated;

-- Admin role is granted ONLY by a trusted database operator after creating an Auth user.
create policy "Admin can read own membership"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Admins manage invoice leads"
  on public.invoice_review_leads for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins manage invoice OCR"
  on public.invoice_ocr_results for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins manage invoice events"
  on public.invoice_lead_events for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

grant select on public.projects, public.project_images to anon;
grant select, insert, update, delete on public.projects, public.project_images to authenticated;

create policy "Published projects are publicly visible"
  on public.projects for select to anon, authenticated
  using (published = true);

create policy "Published project images are publicly visible"
  on public.project_images for select to anon, authenticated
  using (exists (select 1 from public.projects
                where projects.id = project_images.project_id
                and projects.published = true));

create policy "Admins manage projects"
  on public.projects for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins manage project images"
  on public.project_images for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

-- Files: private invoices. The public bucket contains ONLY authorized marketing images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invoice-files', 'invoice-files', false, 10485760,
        array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins read invoices in private storage"
  on storage.objects for select to authenticated
  using (bucket_id = 'invoice-files'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins remove invoices in private storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'invoice-files'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins update project images in storage"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins remove project images in storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

-- NOTE: Do not publish the site based on this SQL alone.
-- Before opening intake: E2E test anon read/write denial, admin access, storage RLS,
-- all schema columns, auth role assignment, notifications, anti-spam and data retention.

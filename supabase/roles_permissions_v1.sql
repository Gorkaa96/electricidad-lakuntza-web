-- Electricidad Lakuntza: server-side roles and per-user privileges.
-- Apply only after bootstrap_electricidad_lakuntza_secure_v2.
-- Owner and admins can delegate scoped privileges; invitations require a trusted server key.
-- Data API must never expose the app_private schema.

alter table public.admin_users
  add column if not exists role text not null default 'agent',
  add column if not exists permissions text[] not null default '{}'::text[],
  add column if not exists active boolean not null default true,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid references auth.users(id) on delete set null;

-- Upgrade the existing first administrator (the only member before migration)
-- without hardcoding a generated Auth user UUID.
update public.admin_users
set role='owner',
    permissions=array[
      'leads.read_all','leads.read_assigned','leads.edit_all',
      'leads.edit_assigned','leads.assign','leads.delete',
      'projects.manage','users.manage'
    ]::text[],
    updated_at=now()
where user_id = (
  select user_id from public.admin_users order by created_at asc, user_id asc limit 1
);

alter table public.admin_users
  add constraint admin_users_valid_role
  check (role in ('owner','admin','agent'));

alter table public.admin_users
  add constraint admin_users_valid_permissions
  check (permissions <@ array[
    'leads.read_all','leads.read_assigned','leads.edit_all',
    'leads.edit_assigned','leads.assign','leads.delete',
    'projects.manage','users.manage'
  ]::text[]);

alter table public.admin_users
  add constraint admin_users_agents_cannot_manage_members
  check (role <> 'agent' or not ('users.manage'=any(permissions)));

alter table public.invoice_review_leads
  add column if not exists assigned_to uuid references public.admin_users(user_id) on delete set null;
create index if not exists invoice_review_leads_assigned_to_idx
  on public.invoice_review_leads(assigned_to, created_at desc);
create index if not exists invoice_review_leads_file_path_idx
  on public.invoice_review_leads(file_path);

create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated;

-- SECURITY DEFINER is used only in a private, non-API-exposed schema
-- to avoid recursive RLS on admin_users.
create or replace function app_private.has_permission(requested text)
returns boolean
language sql stable security definer
set search_path = ''
as $fn$
  select exists (
    select 1 from public.admin_users member
    where member.user_id = (select auth.uid())
      and member.active is true
      and (member.role = 'owner' or requested = any(member.permissions))
  );
$fn$;

revoke all on function app_private.has_permission(text) from public, anon, authenticated;
grant execute on function app_private.has_permission(text) to authenticated;

-- admin_users is readable to its owner and to designated member managers.
drop policy if exists "Admin can read own membership" on public.admin_users;
create policy "Members read own or manageable membership"
  on public.admin_users for select to authenticated
  using (
    user_id=(select auth.uid())
    or (select app_private.has_permission('users.manage'))
  );
-- No client-side INSERT/UPDATE/DELETE of role memberships; trusted server only.

-- A new public invoice is written ONLY by the intake service role.
drop policy if exists "Admins manage invoice leads" on public.invoice_review_leads;
create policy "Authorized users read invoice leads"
  on public.invoice_review_leads for select to authenticated
  using (
    (select app_private.has_permission('leads.read_all'))
    or (
      assigned_to=(select auth.uid())
      and (select app_private.has_permission('leads.read_assigned'))
    )
  );

create policy "Authorized users edit invoice leads"
  on public.invoice_review_leads for update to authenticated
  using (
    (select app_private.has_permission('leads.edit_all'))
    or (
      assigned_to=(select auth.uid())
      and (select app_private.has_permission('leads.edit_assigned'))
    )
  )
  with check (
    (select app_private.has_permission('leads.edit_all'))
    or (
      assigned_to=(select auth.uid())
      and (select app_private.has_permission('leads.edit_assigned'))
    )
  );

create policy "Authorized users delete invoice leads"
  on public.invoice_review_leads for delete to authenticated
  using ((select app_private.has_permission('leads.delete')));

-- History and OCR follow the parent lead's visibility.
drop policy if exists "Admins manage invoice OCR" on public.invoice_ocr_results;
drop policy if exists "Admins manage invoice events" on public.invoice_lead_events;

create policy "Read OCR for visible leads"
  on public.invoice_ocr_results for select to authenticated
  using (
    exists (select 1 from public.invoice_review_leads lead where lead.id=lead_id)
  );
create policy "Write OCR for manageable leads"
  on public.invoice_ocr_results for insert to authenticated
  with check (
    exists (
      select 1 from public.invoice_review_leads lead
      where lead.id=lead_id
      and (
        (select app_private.has_permission('leads.edit_all'))
        or (lead.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned')))
      )
    )
  );
create policy "Update OCR for manageable leads"
  on public.invoice_ocr_results for update to authenticated
  using (
    exists (
      select 1 from public.invoice_review_leads lead
      where lead.id=lead_id
      and (
        (select app_private.has_permission('leads.edit_all'))
        or (lead.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned')))
      )
    )
  )
  with check (
    exists (
      select 1 from public.invoice_review_leads lead
      where lead.id=lead_id
      and (
        (select app_private.has_permission('leads.edit_all'))
        or (lead.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned')))
      )
    )
  );
create policy "Delete OCR for privileged leads"
  on public.invoice_ocr_results for delete to authenticated
  using ((select app_private.has_permission('leads.delete')));

create policy "Read events for visible leads"
  on public.invoice_lead_events for select to authenticated
  using (exists (select 1 from public.invoice_review_leads lead where lead.id=lead_id));
create policy "Write events for manageable leads"
  on public.invoice_lead_events for insert to authenticated
  with check (
    exists (
      select 1 from public.invoice_review_leads lead
      where lead.id=lead_id
      and (
        (select app_private.has_permission('leads.edit_all'))
        or (lead.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned')))
      )
    )
  );
create policy "Delete events for privileged leads"
  on public.invoice_lead_events for delete to authenticated
  using ((select app_private.has_permission('leads.delete')));

-- Avoid overlapping permissive authenticated SELECT policies.
drop policy if exists "Published projects are publicly visible" on public.projects;
drop policy if exists "Published project images are publicly visible" on public.project_images;
drop policy if exists "Admins manage projects" on public.projects;
drop policy if exists "Admins manage project images" on public.project_images;

create policy "Public read published projects" on public.projects
  for select to anon using (published);
create policy "Members read published or managed projects" on public.projects
  for select to authenticated using (published or (select app_private.has_permission('projects.manage')));
create policy "Managers insert projects" on public.projects
  for insert to authenticated with check ((select app_private.has_permission('projects.manage')));
create policy "Managers update projects" on public.projects
  for update to authenticated
  using ((select app_private.has_permission('projects.manage')))
  with check ((select app_private.has_permission('projects.manage')));
create policy "Managers delete projects" on public.projects
  for delete to authenticated using ((select app_private.has_permission('projects.manage')));

create policy "Public read published project images" on public.project_images
  for select to anon
  using (exists (select 1 from public.projects p where p.id=project_id and p.published));
create policy "Members read visible or managed images" on public.project_images
  for select to authenticated
  using (
    (select app_private.has_permission('projects.manage'))
    or exists (select 1 from public.projects p where p.id=project_id and p.published)
  );
create policy "Managers insert project images" on public.project_images
  for insert to authenticated with check ((select app_private.has_permission('projects.manage')));
create policy "Managers update project images" on public.project_images
  for update to authenticated
  using ((select app_private.has_permission('projects.manage')))
  with check ((select app_private.has_permission('projects.manage')));
create policy "Managers delete project images" on public.project_images
  for delete to authenticated using ((select app_private.has_permission('projects.manage')));

-- Private invoice Storage: files are readable only for leads the user may see.
drop policy if exists "Admins read invoices in private storage" on storage.objects;
drop policy if exists "Admins remove invoices in private storage" on storage.objects;
drop policy if exists "Admins upload project images" on storage.objects;
drop policy if exists "Admins update project images in storage" on storage.objects;
drop policy if exists "Admins remove project images in storage" on storage.objects;

create policy "Authorized members read private invoice files"
  on storage.objects for select to authenticated
  using (
    bucket_id='invoice-files'
    and exists (
      select 1 from public.invoice_review_leads lead
      where lead.file_path=storage.objects.name
    )
  );
create policy "Privileged members remove private invoice files"
  on storage.objects for delete to authenticated
  using (
    bucket_id='invoice-files'
    and (select app_private.has_permission('leads.delete'))
    and exists (select 1 from public.invoice_review_leads lead where lead.file_path=storage.objects.name)
  );
create policy "Project managers upload images" on storage.objects
  for insert to authenticated
  with check (bucket_id='project-images' and (select app_private.has_permission('projects.manage')));
create policy "Project managers update images" on storage.objects
  for update to authenticated
  using (bucket_id='project-images' and (select app_private.has_permission('projects.manage')))
  with check (bucket_id='project-images' and (select app_private.has_permission('projects.manage')));
create policy "Project managers delete images" on storage.objects
  for delete to authenticated
  using (bucket_id='project-images' and (select app_private.has_permission('projects.manage')));

-- Tighten dangerous database grants: RLS does NOT protect TRUNCATE and TRIGGER.
revoke all on public.admin_users, public.invoice_review_leads, public.invoice_ocr_results,
  public.invoice_lead_events, public.projects, public.project_images from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select, update, delete on public.invoice_review_leads to authenticated;
grant select, insert, update, delete on public.invoice_ocr_results,
  public.invoice_lead_events to authenticated;
grant select on public.projects, public.project_images to anon;
grant select, insert, update, delete on public.projects, public.project_images to authenticated;
-- The intake backend uses service_role. Keep its explicit DML privileges.
grant select, insert, update, delete on public.admin_users, public.invoice_review_leads,
  public.invoice_ocr_results, public.invoice_lead_events,
  public.projects, public.project_images to service_role;

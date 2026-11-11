-- Feníe proposals: private, versioned attachments associated with the original invoice.
-- No external mail or client-facing link is enabled by this migration.
create table if not exists public.fenie_proposals (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.invoice_review_leads(id) on delete cascade,
 version integer not null check(version between 1 and 10000),
 file_path text not null unique,
 file_name text not null check(length(file_name) between 1 and 255),
 file_size integer not null check(file_size between 1 and 4194304),
 parsed_data jsonb not null default '{}'::jsonb,
 current_total_eur numeric(12,2),
 offer_total_eur numeric(12,2),
 difference_eur numeric(12,2),
 comparison_status text not null default 'not_comparable'
   check(comparison_status in ('not_comparable','estimated_better','estimated_worse','estimated_equal')),
 comparison_reason text not null default 'Revisar la propuesta con una persona.',
 reviewed_at timestamptz,
 reviewed_by uuid references auth.users(id) on delete set null,
 notes text check(notes is null or length(notes)<=1000),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(lead_id,version),
 constraint fenie_review_consistency check ((reviewed_at is null) = (reviewed_by is null))
);
create index if not exists fenie_proposals_lead_version_idx
  on public.fenie_proposals (lead_id,version desc);
alter table public.fenie_proposals enable row level security;
revoke all on public.fenie_proposals from anon, authenticated;
grant select,insert,update,delete on public.fenie_proposals to authenticated;
grant select,insert,update,delete on public.fenie_proposals to service_role;
create policy "Visible proposal for a visible invoice"
 on public.fenie_proposals for select to authenticated
 using(exists(select 1 from public.invoice_review_leads l where l.id=lead_id));
create policy "Proposal uploads for staff managing invoice"
 on public.fenie_proposals for insert to authenticated
 with check(
  created_by=(select auth.uid())
  and exists(select 1 from public.invoice_review_leads l
    where l.id=lead_id and
    ((select app_private.has_permission('leads.edit_all')) or
     (l.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned'))))
  )
 );
create policy "Proposal review for staff managing invoice"
 on public.fenie_proposals for update to authenticated
 using(exists(select 1 from public.invoice_review_leads l where l.id=lead_id and
   ((select app_private.has_permission('leads.edit_all')) or
    (l.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned'))))))
 with check(exists(select 1 from public.invoice_review_leads l where l.id=lead_id and
   ((select app_private.has_permission('leads.edit_all')) or
    (l.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned'))))));
create policy "Delete proposals with lead deletion permission"
 on public.fenie_proposals for delete to authenticated
 using((select app_private.has_permission('leads.delete')));
-- Only reviewed fields are editable: source PDF/version/author and snapshots are immutable.
create or replace function app_private.protect_fenie_proposal()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if (to_jsonb(new)-array['offer_total_eur','difference_eur','comparison_status','comparison_reason',
     'reviewed_at','reviewed_by','notes','updated_at']::text[])
    is distinct from
    (to_jsonb(old)-array['offer_total_eur','difference_eur','comparison_status','comparison_reason',
     'reviewed_at','reviewed_by','notes','updated_at']::text[]) then
  raise exception 'El documento de la propuesta es inmutable; añade otra versión'
    using errcode='42501';
 end if;
 new.updated_at:=now();
 return new;
end; $$;
revoke all on function app_private.protect_fenie_proposal() from public,anon,authenticated;
create trigger protect_fenie_proposal before update on public.fenie_proposals
 for each row execute function app_private.protect_fenie_proposal();

-- All files live in the EXISTING private bucket. Public URL access is prohibited.
-- Path: propuestas/<invoice_uuid>/<proposal_uuid>.pdf, never overwrite.
create policy "Staff upload proposals for their visible invoice"
 on storage.objects for insert to authenticated
 with check(
  bucket_id='invoice-files'
  and name ~ '^propuestas/[0-9a-f-]{36}/[0-9a-f-]{36}\.pdf$'
  and exists(select 1 from public.invoice_review_leads l
     where l.id::text=split_part(name,'/',2) and
      ((select app_private.has_permission('leads.edit_all')) or
       (l.assigned_to=(select auth.uid()) and (select app_private.has_permission('leads.edit_assigned')))))
 );
create policy "Read private proposal with visible invoice"
 on storage.objects for select to authenticated
 using(bucket_id='invoice-files'
    and exists(select 1 from public.fenie_proposals p where p.file_path=name));
create policy "Privileged staff remove proposal files"
 on storage.objects for delete to authenticated
 using(bucket_id='invoice-files'
  and name like 'propuestas/%'
  and (select app_private.has_permission('leads.delete'))
  and exists(select 1 from public.invoice_review_leads l
       where l.id::text=split_part(name,'/',2))
 );

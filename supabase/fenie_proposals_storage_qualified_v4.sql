-- Qualify storage.objects.name explicitly: invoice_review_leads also contains
-- a "name" column, so a bare "name" inside the subquery resolves incorrectly.
drop policy if exists "Staff upload proposals for their visible invoice" on storage.objects;
create policy "Staff upload proposals for their visible invoice"
 on storage.objects for insert to authenticated with check(
   bucket_id='invoice-files'
   and storage.objects.name ~ '^propuestas/[0-9a-f-]{36}/[0-9a-f-]{36}[.]pdf$'
   and exists(select 1 from public.invoice_review_leads l
     where l.id::text=split_part(storage.objects.name,'/',2)
     and ((select app_private.has_permission('leads.edit_all'))
         or (l.assigned_to=(select auth.uid())
             and (select app_private.has_permission('leads.edit_assigned'))))
   )
 );
drop policy if exists "Visible invoice members can precheck proposal file" on storage.objects;
create policy "Visible invoice members can precheck proposal file"
 on storage.objects for select to authenticated using(
   bucket_id='invoice-files'
   and storage.objects.name ~ '^propuestas/[0-9a-f-]{36}/[0-9a-f-]{36}[.]pdf$'
   and exists(select 1 from public.invoice_review_leads l
     where l.id::text=split_part(storage.objects.name,'/',2))
 );
drop policy if exists "Privileged staff remove proposal files" on storage.objects;
create policy "Privileged staff remove proposal files"
 on storage.objects for delete to authenticated using(
   bucket_id='invoice-files' and storage.objects.name like 'propuestas/%'
   and (select app_private.has_permission('leads.delete'))
   and exists(select 1 from public.invoice_review_leads l
      where l.id::text=split_part(storage.objects.name,'/',2))
 );

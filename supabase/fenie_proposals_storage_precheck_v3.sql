drop policy if exists "Visible invoice members can precheck proposal file" on storage.objects;
create policy "Visible invoice members can precheck proposal file"
  on storage.objects for select to authenticated
  using (
    bucket_id='invoice-files'
    and name ~ '^propuestas/[0-9a-f-]{36}/[0-9a-f-]{36}[.]pdf$'
    and exists (
      select 1 from public.invoice_review_leads l
      where l.id::text = split_part(name,'/',2)
    )
  );

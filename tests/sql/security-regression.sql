begin;
do $qa$
declare
  agent_id uuid := gen_random_uuid();
  admin_id uuid := gen_random_uuid();
  owner_id uuid := gen_random_uuid();
  a uuid := gen_random_uuid();
  b uuid := gen_random_uuid();
  n integer;
begin
  insert into auth.users(id,email,role,aud) values
    (agent_id,'qa-agent-'||agent_id||'@example.invalid','authenticated','authenticated'),
    (admin_id,'qa-admin-'||admin_id||'@example.invalid','authenticated','authenticated'),
    (owner_id,'qa-owner-'||owner_id||'@example.invalid','authenticated','authenticated');
  insert into public.admin_users(user_id,email,role,permissions) values
    (agent_id,'qa-agent@example.invalid','agent',array['leads.read_assigned','leads.edit_assigned']),
    (admin_id,'qa-admin@example.invalid','admin',array['leads.read_all','leads.edit_all']),
    (owner_id,'qa-owner@example.invalid','owner','{}');
  insert into public.invoice_review_leads
    (id,name,phone,supply_type,customer_type,consent_accepted,file_path,file_name,file_type,file_size,assigned_to,consent_accepted_at,privacy_notice_version,notification_status)
    values
    (a,'QA assigned','600000000','luz','vivienda',true,'qa/'||a||'.pdf','synthetic.pdf','application/pdf',100,agent_id,now(),'qa-v2','pending'),
    (b,'QA unassigned','600000001','gas','vivienda',true,'qa/'||b||'.pdf','synthetic.pdf','application/pdf',100,null,null,null,'not_requested');
  perform set_config('request.jwt.claim.sub',agent_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',agent_id,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.invoice_review_leads where id in (a,b);
  if n<>1 then raise exception 'agent invoice isolation failed'; end if;
  select count(*) into n from public.commercial_leads where invoice_review_lead_id in (a,b);
  if n<>1 then raise exception 'agent CRM isolation failed'; end if;
  update public.invoice_review_leads set status='reviewing' where id=a;
  if not exists(select 1 from public.commercial_leads where invoice_review_lead_id=a and status='reviewing') then raise exception 'sync invoice to CRM failed'; end if;
  update public.commercial_leads set status='contacted' where invoice_review_lead_id=a;
  if not exists(select 1 from public.invoice_review_leads where id=a and status='contacted') then raise exception 'sync CRM to invoice failed'; end if;
  update public.invoice_review_leads set status='converted' where id=b;
  get diagnostics n = row_count;
  if n<>0 then raise exception 'agent updated another invoice'; end if;
  begin
    update public.commercial_leads set contact_name='forbidden' where invoice_review_lead_id=a;
    raise exception 'agent identity mutation allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.invoice_review_leads set consent_accepted_at=null where id=a;
    raise exception 'agent changed privacy evidence';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.commercial_leads set assigned_to=null where invoice_review_lead_id=a;
    raise exception 'agent reassignment allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.admin_users set role='owner' where user_id=agent_id;
    raise exception 'membership escalation allowed';
  exception when insufficient_privilege then null;
  end;
  if app_private.has_permission('users.manage') then raise exception 'agent member management allowed'; end if;
  execute 'reset role';
  update public.admin_users set active=false where user_id=agent_id;
  execute 'set local role authenticated';
  select count(*) into n from public.invoice_review_leads where id in(a,b);
  if n<>0 then raise exception 'inactive agent retains access'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',admin_id,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.invoice_review_leads where id in(a,b);
  if n<>2 then raise exception 'admin scoped read failed'; end if;
  if app_private.has_permission('users.manage') or app_private.has_permission('leads.delete') then raise exception 'admin unauthorized permissions'; end if;
  delete from public.invoice_review_leads where id=b;
  get diagnostics n=row_count;
  if n<>0 then raise exception 'limited admin deleted invoice'; end if;
  execute 'reset role';

  perform set_config('request.jwt.claim.sub',owner_id::text,true);
  perform set_config('request.jwt.claims',jsonb_build_object('sub',owner_id,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  if not app_private.has_permission('users.manage') then raise exception 'owner permissions failed'; end if;
  delete from public.invoice_review_leads where id=b;
  if exists(select 1 from public.commercial_leads where invoice_review_lead_id=b) then raise exception 'CRM cascade failed'; end if;
  execute 'reset role';
  update public.invoice_review_leads set notification_status='failed' where id=a;
  if not exists(select 1 from public.commercial_leads where invoice_review_lead_id=a and notification_status='failed' and privacy_notice_version='qa-v2') then raise exception 'traceability sync failed'; end if;

  execute 'set local role anon';
  if has_table_privilege('anon','public.invoice_review_leads','SELECT') or has_table_privilege('anon','public.commercial_leads','INSERT') then raise exception 'anon grants exposed'; end if;
  if has_function_privilege('anon','public.consume_public_intake_quota(text)','EXECUTE') then raise exception 'anon quota RPC exposed'; end if;
  execute 'reset role';
  for n in 1..4 loop
    if not public.consume_public_intake_quota(repeat('b',64)) then raise exception 'quota denied too early'; end if;
  end loop;
  if public.consume_public_intake_quota(repeat('b',64)) then raise exception 'quota fifth request allowed'; end if;
end;
$qa$;
rollback;
select 'PASS: owner/admin/agent/anon, revocation, field guards, bidirectional CRM, consent/notification sync, cascade and fifth-attempt quota; all fixtures rolled back' as result;
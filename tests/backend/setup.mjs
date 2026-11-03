import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
import { buildSyntheticInvoicePdf } from '../fixtures/invoice-pdf.mjs';

if (process.env.CI !== 'true' || !process.env.RUNNER_TEMP) throw new Error('Disposable GitHub runner required');
const raw = await readFile(process.env.LOCAL_SUPABASE_ENV, 'utf8');
const vars = Object.fromEntries(raw.split('\n').filter(l=>/^[A-Z_]+=/.test(l)).map(l=>{
  const n=l.indexOf('='); return [l.slice(0,n), l.slice(n+1).replace(/^"|"$/g,'')];
}));
const url = vars.API_URL;
if (new URL(url).origin !== 'http://127.0.0.1:54321' || !vars.DB_URL.startsWith('postgresql://postgres:postgres@127.0.0.1:54322/')) throw new Error('Only isolated loopback services are allowed');
const env = {
  SUPABASE_URL:url, SUPABASE_ANON:vars.ANON_KEY, SUPABASE_SERVICE:vars.SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL:url, NEXT_PUBLIC_SUPABASE_ANON_KEY:vars.ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY:vars.SERVICE_ROLE_KEY,
  INVOICE_INTAKE_ENABLED:'false',PUBLIC_COMMERCIAL_INTAKE_ENABLED:'false',NEXT_PUBLIC_PUBLICATION_ENABLED:'false',
};
for (const [k,v] of Object.entries(env)) {
  if (!v) throw new Error('Missing disposable configuration: '+k);
  if (/KEY|SERVICE|ANON/.test(k)) console.log('::add-mask::'+v);
}
await appendFile(process.env.GITHUB_ENV,Object.entries(env).map(([k,v])=>k+'='+v).join('\n')+'\n');
const scripts = ['bootstrap_v2','roles_permissions_v1','agent_assignments_v1','agent_limited_edit_v1','commercial_crm_v1','intake_sync_rate_limit_v1','fix_intake_rate_limit_arg_v1','intake_traceability_v1','sync_intake_traceability_v1','commercial_fk_indexes_v1'];
for (const file of [...scripts.map(n=>'supabase/'+n+'.sql'),'tests/sql/security-regression.sql']) {
  const r=spawnSync('psql',[vars.DB_URL,'-v','ON_ERROR_STOP=1','-f',file],{encoding:'utf8'});
  if(r.status!==0) { console.error(r.stderr); throw new Error('SQL verification failed: '+file); }
  console.log('SQL OK: '+file);
}
const service=createClient(url,vars.SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const fixtures={url,anon:vars.ANON_KEY,service:vars.SERVICE_ROLE_KEY,users:{}};
for (const role of ['owner','admin','agent','other']) {
  const email=role+'@example.test', password=randomBytes(24).toString('base64url');
  console.log('::add-mask::'+password);
  const {data,error}=await service.auth.admin.createUser({email,password,email_confirm:true});
  if(error)throw error;
  const permissions=role==='owner'?[]:role==='admin'?['leads.read_all','leads.edit_all','leads.assign','leads.delete','users.manage']:['leads.read_assigned','leads.edit_assigned'];
  const {error:memberError}=await service.from('admin_users').insert({user_id:data.user.id,email,role:role==='other'?'agent':role,permissions,active:true});
  if(memberError)throw memberError;
  fixtures.users[role]={id:data.user.id,email,password};
}
const path='qa/'+crypto.randomUUID()+'.pdf';
const bytes=buildSyntheticInvoicePdf();
const upload=await service.storage.from('invoice-files').upload(path,bytes,{contentType:'application/pdf'});
if(upload.error)throw upload.error;
const lead=await service.from('invoice_review_leads').insert({
  name:'Persona de prueba',phone:'600000001',email:'fixture@example.test',
  supply_type:'luz',customer_type:'vivienda',bonus_status:'no',consent_accepted:true,
  file_path:path,file_name:'factura-sintetica.pdf',file_type:'application/pdf',file_size:bytes.length,
  assigned_to:fixtures.users.agent.id,notification_status:'pending',
}).select('id').single();
if(lead.error)throw lead.error;
fixtures.invoiceId=lead.data.id;fixtures.path=path;
await writeFile(process.env.QA_FIXTURES,JSON.stringify(fixtures),{mode:0o600});
console.log('Disposable Auth accounts and synthetic invoice prepared. No cloud connection.');

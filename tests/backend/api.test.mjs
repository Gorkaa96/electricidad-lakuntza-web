import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createClient } from '@supabase/supabase-js';
import { buildSyntheticInvoicePdf } from '../fixtures/invoice-pdf.mjs';
const f=JSON.parse(await readFile(process.env.QA_FIXTURES,'utf8'));
if(process.env.CI!=='true'||f.url!=='http://127.0.0.1:54321')throw new Error('Isolated backend only');
const client=key=>createClient(f.url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const service=client(f.service), anonymous=client(f.anon);
async function signed(role){const c=client(f.anon);const r=await c.auth.signInWithPassword(f.users[role]);assert.equal(r.error,null);return c;}

test('anonymous cannot read or write invoices or fetch their files',async()=>{
  const rows=await anonymous.from('invoice_review_leads').select('id');
  assert.ok(rows.error||rows.data.length===0);
  assert.ok((await anonymous.storage.from('invoice-files').download(f.path)).error);
  const publicUrl=service.storage.from('invoice-files').getPublicUrl(f.path).data.publicUrl;
  assert.equal((await fetch(publicUrl)).ok,false);
});

test('actual Auth sessions enforce owner/admin/agent file and row access',async()=>{
  for(const role of ['owner','admin','agent']){
    const c=await signed(role);
    const row=await c.from('invoice_review_leads').select('id').eq('id',f.invoiceId).single();
    assert.equal(row.error,null,role);
    assert.equal((await c.storage.from('invoice-files').download(f.path)).error,null,role);
  }
  const other=await signed('other');
  const row=await other.from('invoice_review_leads').select('id').eq('id',f.invoiceId);
  assert.deepEqual(row.data,[]);
  assert.ok((await other.storage.from('invoice-files').download(f.path)).error);
});

test('revocation blocks already-issued sessions and agent cannot change private identity',async()=>{
  const agent=await signed('agent');
  const tamper=await agent.from('invoice_review_leads').update({phone:'600000099'}).eq('id',f.invoiceId);
  assert.ok(tamper.error);
  assert.equal((await service.from('admin_users').update({active:false}).eq('user_id',f.users.agent.id)).error,null);
  const hidden=await agent.from('invoice_review_leads').select('id').eq('id',f.invoiceId);
  assert.deepEqual(hidden.data,[]);
  assert.ok((await agent.storage.from('invoice-files').download(f.path)).error);
  assert.equal((await service.from('admin_users').update({active:true}).eq('user_id',f.users.agent.id)).error,null);
});

test('CRM link follows invoice status and all five service types can be managed',async()=>{
  const owner=await signed('owner');
  for(const type of ['luz','gas','alarmas','cargadores','asesoria']){
    const r=await owner.from('commercial_leads').insert({service:type,contact_name:'Consulta ficticia',contact_phone:'600000002',customer_type:'vivienda',created_by:f.users.owner.id}).select('id').single();
    assert.equal(r.error,null,type);
    assert.equal((await owner.from('commercial_leads').delete().eq('id',r.data.id)).error,null);
  }
  const status=await owner.from('invoice_review_leads').update({status:'reviewing'}).eq('id',f.invoiceId);
  assert.equal(status.error,null);
  const crm=await owner.from('commercial_leads').select('status,assigned_to').eq('invoice_review_lead_id',f.invoiceId).single();
  assert.equal(crm.error,null);assert.equal(crm.data.status,'reviewing');assert.equal(crm.data.assigned_to,f.users.agent.id);
});

test('synthetic file snapshot can be removed and restored byte-for-byte',async()=>{
  const path='qa/restore-'+crypto.randomUUID()+'.pdf', original=buildSyntheticInvoicePdf();
  assert.equal((await service.storage.from('invoice-files').upload(path,original,{contentType:'application/pdf'})).error,null);
  const copy=await service.storage.from('invoice-files').download(path);
  assert.equal(copy.error,null);
  const snapshot=Buffer.from(await copy.data.arrayBuffer());
  assert.equal((await service.storage.from('invoice-files').remove([path])).error,null);
  assert.ok((await service.storage.from('invoice-files').download(path)).error);
  assert.equal((await service.storage.from('invoice-files').upload(path,snapshot,{contentType:'application/pdf'})).error,null);
  const restored=await service.storage.from('invoice-files').download(path);
  assert.deepEqual(Buffer.from(await restored.data.arrayBuffer()),original);
  assert.equal((await service.storage.from('invoice-files').remove([path])).error,null);
});

test('Auth invitation reaches the isolated SMTP inbox',async()=>{
  assert.equal(new URL(f.mailUrl).hostname,'127.0.0.1');
  const invitation=await service.auth.admin.inviteUserByEmail('invitation@example.test',{redirectTo:'http://127.0.0.1:3002/admin/activar-cuenta'});
  assert.equal(invitation.error,null);
  let delivered;
  for(let n=0;n<25;n++){
    const response=await fetch(f.mailUrl+'/api/v1/messages');
    assert.equal(response.ok,true);
    const inbox=await response.json();
    delivered=(inbox.messages||[]).find(m=>(m.To||[]).some(to=>to.Address==='invitation@example.test'));
    if(delivered)break;
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(delivered,'Invitation should reach local SMTP, never an external mailbox');
  const message=await (await fetch(f.mailUrl+'/api/v1/message/'+delivered.ID)).json();
  const hrefs=[...(message.HTML||'').matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
  const link=hrefs.find(h=>h.startsWith('http://127.0.0.1:54321/auth/v1/verify'));
  assert.ok(link,'Local verification link must be present in the received email');
  const member=await service.from('admin_users').insert({user_id:invitation.data.user.id,email:'invitation@example.test',role:'agent',permissions:['leads.read_assigned','leads.edit_assigned'],active:true});
  assert.equal(member.error,null);
  f.inviteLink=link;
  await writeFile(process.env.QA_FIXTURES,JSON.stringify(f),{mode:0o600});
});

test('trusted intake service persists notification without private helper privileges',async()=>{
  const updated=await service.from('invoice_review_leads').update({notification_status:'accepted'}).eq('id',f.invoiceId).select('notification_status').single();
  assert.equal(updated.error,null);
  assert.equal(updated.data.notification_status,'accepted');
  const crm=await service.from('commercial_leads').select('notification_status').eq('invoice_review_lead_id',f.invoiceId).single();
  assert.equal(crm.error,null);assert.equal(crm.data.notification_status,'accepted');
});

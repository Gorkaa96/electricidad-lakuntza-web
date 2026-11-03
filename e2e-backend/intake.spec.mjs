import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {buildSyntheticInvoicePdf} from '../tests/fixtures/invoice-pdf.mjs';
const f=JSON.parse(await readFile(process.env.QA_FIXTURES,'utf8'));
const service=createClient(f.url,f.service,{auth:{persistSession:false}});
test.beforeEach(async({page})=>{
  await page.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});
async function captcha(page,token){
  await page.locator('form').evaluate((el,value)=>{
    const field=document.createElement('input');field.type='hidden';field.name='cf-turnstile-response';field.value=value;el.appendChild(field);
  },token);
}
async function submitInvoice(page,{phone,email,token}){
  await page.goto('/revision-factura-luz-gas');
  const form=page.locator('form#formulario');
  await form.locator('[name=bonusStatus]').selectOption('no');
  await form.locator('[name=name]').fill('Solicitud ficticia');
  await form.locator('[name=phone]').fill(phone);
  await form.locator('[name=email]').fill(email);
  await form.locator('input[type=file]').setInputFiles({name:'ficticia.pdf',mimeType:'application/pdf',buffer:buildSyntheticInvoicePdf()});
  await form.locator('[name=consent]').check();
  await captcha(page,token);
  await page.getByRole('button',{name:'Enviar factura para revisión',exact:true}).click();
  await expect(page).toHaveURL(/\/revision-factura-luz-gas\/gracias/);
  const r=await service.from('invoice_review_leads').select('*').eq('email',email).single();
  expect(r.error).toBeNull();return r.data;
}
async function eraseInvoice(id,path){
  expect((await service.storage.from('invoice-files').remove([path])).error).toBeNull();
  expect((await service.from('invoice_review_leads').delete().eq('id',id)).error).toBeNull();
}
test('synthetic invoice travels from public form through Storage, CRM, OCR and complete app deletion',async({page},info)=>{
  await page.setExtraHTTPHeaders({'x-forwarded-for':'192.0.2.10'});
  const lead=await submitInvoice(page,{phone:'600000010',email:'intake@example.test',token:'qa-invoice'});
  expect(lead.notification_status).toBe('accepted');
  expect(lead.privacy_notice_version).toBeTruthy();expect(lead.consent_accepted_at).toBeTruthy();
  expect((await service.storage.from('invoice-files').download(lead.file_path)).error).toBeNull();
  const crm=await service.from('commercial_leads').select('id,notification_status').eq('invoice_review_lead_id',lead.id).single();
  expect(crm.error).toBeNull();expect(crm.data.notification_status).toBe('accepted');
  await info.attach('invoice submission confirmed',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await page.goto('/admin/login');
  await page.getByLabel('Correo electrónico',{exact:true}).fill(f.users.owner.email);
  await page.getByLabel('Contraseña',{exact:true}).fill(f.users.owner.password);
  await page.getByRole('button',{name:'Entrar al panel',exact:true}).click();
  await expect(page).not.toHaveURL(/\/admin\/login/);
  await page.goto('/admin/facturas/'+lead.id);
  await page.getByRole('button',{name:'Procesar lectura',exact:true}).click();
  await expect(page).toHaveURL(/success=ocr_completado/);
  expect((await service.from('invoice_ocr_results').select('ocr_status').eq('lead_id',lead.id).single()).data.ocr_status).toBe('succeeded');
  await page.locator('select[name=assignedTo]').selectOption(f.users.agent.id);
  await page.getByRole('button',{name:'Guardar asignación',exact:true}).click();
  await expect.poll(async()=> (await service.from('commercial_leads').select('assigned_to').eq('id',crm.data.id).single()).data.assigned_to).toBe(f.users.agent.id);
  await page.goto('/admin/facturas/'+lead.id+'/eliminar');
  await page.getByLabel('Escribe ELIMINAR para confirmar',{exact:true}).fill('ELIMINAR');
  await page.getByRole('button',{name:'Eliminar definitivamente',exact:true}).click();
  await expect(page).toHaveURL(/success=eliminada/);
  for(const [table,key] of [['invoice_review_leads','id'],['invoice_ocr_results','lead_id'],['invoice_lead_events','lead_id'],['commercial_leads','invoice_review_lead_id']]){
    const rows=await service.from(table).select('id').eq(key,lead.id);expect(rows.error).toBeNull();expect(rows.data).toEqual([]);
  }
  expect((await service.storage.from('invoice-files').download(lead.file_path)).error).not.toBeNull();
  const events=(await readFile(process.env.RUNNER_TEMP+'/lakuntza-provider-events.jsonl','utf8')).trim().split('\n').map(JSON.parse);
  const mail=events.find(e=>e.kind==='mail'&&!e.failed);
  expect(mail.attachments).toBe(0);expect(mail.text).not.toContain('600000010');expect(mail.text).not.toContain('intake@example.test');
});
test('failed mail leaves the invoice and CRM available for manual follow-up',async({page},info)=>{
  await page.setExtraHTTPHeaders({'x-forwarded-for':'192.0.2.11'});
  const lead=await submitInvoice(page,{phone:'600000011',email:'mail-failure@example.test',token:'qa-invoice-mail-failure'});
  expect(lead.notification_status).toBe('failed');
  expect((await service.storage.from('invoice-files').download(lead.file_path)).error).toBeNull();
  const crm=await service.from('commercial_leads').select('notification_status').eq('invoice_review_lead_id',lead.id).single();
  expect(crm.data.notification_status).toBe('failed');
  await info.attach('confirmation despite failed notice',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  await eraseInvoice(lead.id,lead.file_path);
});
test('all five services are captured through the actual public action with consent and notification',async({page})=>{
  for(const [n,type] of ['luz','gas','alarmas','cargadores','asesoria'].entries()){
    await page.setExtraHTTPHeaders({'x-forwarded-for':'192.0.2.'+(20+n)});
    await page.goto('/consulta?servicio='+type);
    await page.locator('[name=contactName]').fill('Consulta ficticia '+type);
    await page.locator('[name=contactPhone]').fill('60000002'+n);
    await page.locator('[name=message]').fill('Consulta ficticia de prueba para '+type);
    await page.locator('[name=consent]').check();
    await captcha(page,'qa-commercial');
    await page.getByRole('button',{name:'Enviar consulta',exact:true}).click();
    await expect(page).toHaveURL(/\/consulta\/gracias/);
    const rows=await service.from('commercial_leads').select('*').eq('contact_name','Consulta ficticia '+type).single();
    expect(rows.error).toBeNull();expect(rows.data.service).toBe(type);expect(rows.data.notification_status).toBe('accepted');
    expect(rows.data.consent_accepted_at).toBeTruthy();
    expect((await service.from('commercial_leads').delete().eq('id',rows.data.id)).error).toBeNull();
  }
});

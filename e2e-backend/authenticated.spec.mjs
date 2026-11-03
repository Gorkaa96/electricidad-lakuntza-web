import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
const f=JSON.parse(await readFile(process.env.QA_FIXTURES,'utf8'));
async function login(page,role){
  await page.goto('/admin/login');
  await page.getByRole('textbox',{name:'Correo electrónico',exact:true}).fill(f.users[role].email);
  await page.getByLabel('Contraseña',{exact:true}).fill(f.users[role].password);
  await page.getByRole('button',{name:'Entrar al panel',exact:true}).click();
  await expect(page).not.toHaveURL(/\/admin\/login/);
}
for(const role of ['owner','admin','agent']){
  test('real '+role+' session opens assigned invoice and downloads private PDF',async({page},info)=>{
    await login(page,role);
    await page.goto('/admin/facturas/'+f.invoiceId);
    await expect(page.getByRole('heading',{name:'Persona de prueba',exact:true})).toBeVisible();
    const result=await page.request.get('/admin/facturas/'+f.invoiceId+'/archivo');
    expect(result.status()).toBe(200);
    expect(result.headers()['cache-control']).toContain('no-store');
    expect((await result.body()).subarray(0,5).toString()).toBe('%PDF-');
    await info.attach(role+' invoice',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
    const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  });
}
test('owner runs actual PDF extraction through the application',async({page},info)=>{
  await login(page,'owner');
  await page.goto('/admin/facturas/'+f.invoiceId);
  await page.getByRole('button',{name:'Procesar lectura',exact:true}).click();
  await expect(page).toHaveURL(/success=ocr_completado/);
  await expect(page.getByText('Campos detectados',{exact:false})).toBeVisible();
  const service=createClient(f.url,f.service,{auth:{persistSession:false}});
  const r=await service.from('invoice_ocr_results').select('ocr_status,requires_manual_review,extracted_json').eq('lead_id',f.invoiceId).single();
  expect(r.error).toBeNull();expect(r.data.ocr_status).toBe('succeeded');
  expect(r.data.requires_manual_review).toBe(true);
  expect(r.data.extracted_json.review.suggested_analysis_result).toBe('review');
  await info.attach('synthetic OCR',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
test('unassigned agent cannot read another invoice via page or download',async({page})=>{
  await login(page,'other');
  await page.goto('/admin/facturas/'+f.invoiceId);
  await expect(page.getByRole('heading',{name:'Persona de prueba',exact:true})).toHaveCount(0);
  expect((await page.request.get('/admin/facturas/'+f.invoiceId+'/archivo')).status()).not.toBe(200);
});
test('owner deletes invoice through app and file, CRM and OCR disappear',async({page})=>{
  await login(page,'owner');
  await page.goto('/admin/facturas/'+f.invoiceId+'/eliminar');
  await page.getByLabel('Escribe ELIMINAR para confirmar',{exact:true}).fill('ELIMINAR');
  await page.getByRole('button',{name:'Eliminar definitivamente',exact:true}).click();
  await expect(page).toHaveURL(/\/admin\/facturas\?success=/);
  const service=createClient(f.url,f.service,{auth:{persistSession:false}});
  for(const [table,key] of [['invoice_review_leads','id'],['invoice_ocr_results','lead_id'],['commercial_leads','invoice_review_lead_id']]){
    const r=await service.from(table).select('*').eq(key,f.invoiceId);expect(r.error).toBeNull();expect(r.data).toEqual([]);
  }
  expect((await service.storage.from('invoice-files').download(f.path)).error).not.toBeNull();
});

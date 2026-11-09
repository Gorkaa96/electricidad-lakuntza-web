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
  await page.locator('summary').filter({hasText:'Ver lectura y datos avanzados de la factura'}).click();
  await expect(page.locator('span').filter({hasText:/^Campos detectados/})).toBeVisible();
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
test('owner uploads a Fenie PDF, validates the comparison and prepares Yahoo reply', async ({page})=>{
  await login(page,'owner');
  await page.goto('/admin/facturas/'+f.invoiceId);
  const service=createClient(f.url,f.service,{auth:{persistSession:false}});
  const before=await service.from('invoice_review_leads').select('invoice_total_eur').eq('id',f.invoiceId).single();
  expect(before.error).toBeNull();
  // The preceding extraction reads the 150 EUR fictitious invoice. This test
  // checks the private browser upload flow, not the parsing accuracy of Fenie templates.
  expect(Number(before.data.invoice_total_eur)).toBeGreaterThan(0);
  const {buildSyntheticInvoicePdf}=await import('../tests/fixtures/invoice-pdf.mjs');
  await page.locator('input[name=proposal]').setInputFiles({
    name:'propuesta-fenia-ficticia.pdf',mimeType:'application/pdf',buffer:buildSyntheticInvoicePdf()
  });
  await page.getByRole('button',{name:'Subir y comparar'}).click();
  await expect(page).toHaveURL(/propuestaOk=subida/);
  await expect(page.getByText('Versión 1',{exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Revisar y confirmar'})).toBeVisible();
  await page.locator('input[name=offerTotal]').fill('130,00');
  await page.locator('input[name=confirmed]').check();
  await page.getByRole('button',{name:'Confirmar comparación'}).click();
  await expect(page).toHaveURL(/propuestaOk=revisada/);
  await expect(page.getByRole('heading',{name:'3. Preparar correo al cliente'})).toBeVisible();
  await expect(page.getByRole('button',{name:'3. Copiar mensaje'})).toBeVisible();
  const p=await service.from('fenie_proposals').select('id,reviewed_at').eq('lead_id',f.invoiceId).single();
  expect(p.error).toBeNull();expect(p.data.reviewed_at).toBeTruthy();
  const pdf=await page.request.get('/admin/facturas/'+f.invoiceId+'/propuesta/'+p.data.id+'/archivo');
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
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

test('received invitation activates a fictitious agent account',async({page},info)=>{
  expect(new URL(f.inviteLink).hostname).toBe('127.0.0.1');
  await page.goto(f.inviteLink);
  await expect(page).toHaveURL(/\/admin\/activar-cuenta/);
  const password=crypto.randomUUID()+'Aa9!';
  await page.getByLabel('Contraseña nueva',{exact:true}).fill(password);
  await page.getByLabel('Repetir contraseña',{exact:true}).fill(password);
  await page.getByRole('button',{name:'Activar mi cuenta',exact:true}).click();
  await expect(page).toHaveURL(/\/admin\/(entrada|resumen|oportunidades|facturas)/);
  await info.attach('activated fictitious agent',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('CRM overview respects agent assignment and has accessible navigation',async({page})=>{
 await login(page,'other'); await page.goto('/admin/resumen');
 await expect(page.getByRole('heading',{name:'Resumen',exact:true})).toBeVisible();
 await expect(page.getByText('Persona de prueba',{exact:true})).toHaveCount(0);
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(audit.violations.map(v=>v.id)).toEqual([]);
});

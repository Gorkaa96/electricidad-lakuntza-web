import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {buildSyntheticInvoicePdf} from '../tests/fixtures/invoice-pdf.mjs';

test.beforeEach(async({page})=>{
  // Render and reject unverified input; never contact a real captcha/mail provider.
  await page.route('**/*',route=>{
    const host=new URL(route.request().url()).hostname;
    return ['127.0.0.1','localhost'].includes(host)?route.continue():route.abort();
  });
});
test('invoice form enforces eligibility, file size, format and consent',async({page},info)=>{
  await page.goto('/revision-factura-luz-gas?servicio=luz');
  const form=page.locator('form#formulario');
  await expect(form).toBeVisible();
  await form.locator('[name=bonusStatus]').selectOption('si');
  await expect(page.getByRole('alert')).toContainText('consulta primero el bono social');
  expect(await form.locator('[name=bonusStatus]').evaluate(el=>el.validity.valid)).toBe(false);
  await form.locator('[name=supplyType]').selectOption('gas');
  await expect(form.locator('select[name=bonusStatus]')).toHaveCount(0);
  await form.locator('[name=supplyType]').selectOption('luz_gas');
  await form.locator('[name=bonusStatus]').selectOption('no');
  const input=form.locator('input[type=file]');
  await input.setInputFiles({name:'unsupported.txt',mimeType:'text/plain',buffer:Buffer.from('not an invoice')});
  await expect(page.getByRole('alert')).toContainText('Formato no admitido');
  await input.setInputFiles({name:'large.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(10*1024*1024+1)});
  await expect(page.getByRole('alert')).toContainText('supera los 10 MB');
  await input.setInputFiles({name:'factura-ficticia.pdf',mimeType:'application/pdf',buffer:buildSyntheticInvoicePdf()});
  await expect(page.getByRole('alert')).toHaveCount(0);
  await form.locator('[name=name]').fill('Prueba ficticia');
  await form.locator('[name=phone]').fill('600000003');
  expect(await form.locator('[name=consent]').evaluate(el=>el.validity.valueMissing)).toBe(true);
  await form.locator('[name=consent]').check();
  expect(await form.evaluate(el=>el.checkValidity())).toBe(true);
  await info.attach('invoice form synthetic input',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.getByRole('button',{name:'Enviar factura para revisión',exact:true}).click();
  await expect(page).toHaveURL(/error=verificacion/);
  await expect(page.getByRole('alert')).toContainText('verificación de seguridad');
});
test('all five commercial services render with context and reject missing human verification',async({page},info)=>{
  for(const service of ['luz','gas','alarmas','cargadores','asesoria']){
    await page.goto('/consulta?servicio='+service);
    await expect(page.locator('select[name=service]')).toHaveValue(service);
  }
  await page.locator('[name=contactName]').fill('Consulta ficticia');
  await page.locator('[name=contactEmail]').fill('qa@example.test');
  await page.locator('[name=message]').fill('Consulta ficticia de validación del formulario.');
  await page.locator('[name=consent]').check();
  await info.attach('commercial form synthetic input',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await page.getByRole('button',{name:'Enviar consulta',exact:true}).click();
  await expect(page).toHaveURL(/error=verificacion/);
  await expect(page.getByRole('alert')).toContainText('comprobación de seguridad');
});

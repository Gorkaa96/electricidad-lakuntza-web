import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('preview exposes actual fields and sample without sending personal data', async ({page}, info) => {
  await page.goto('/revision-factura-luz-gas');
  await expect(page.getByRole('link',{name:'Probar formulario de factura',exact:true})).toHaveAttribute('href','#formulario');
  await page.getByRole('button',{name:'Usar datos y factura de ejemplo',exact:true}).click();
  await expect(page.getByText('factura-ficticia.pdf',{exact:true})).toBeVisible();
  await page.locator('select[name="bonusStatus"]').selectOption('no');
  await page.locator('input[name="consent"]').check();
  const writes=[];
  page.on('request',r=>{if(r.method()!=='GET') writes.push({method:r.method(),url:r.url()});});
  await page.getByRole('button',{name:'Comprobar formulario sin enviar',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Comprobación local completada');
  expect(writes).toEqual([]);
  await expect(page).not.toHaveURL(/gracias/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await info.attach('visible preview form',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('rehearsal rejects invalid phone and still enforces eligibility and consent',async({page})=>{
  await page.goto('/revision-factura-luz-gas');
  await page.getByRole('button',{name:'Usar datos y factura de ejemplo',exact:true}).click();
  await page.locator('select[name="bonusStatus"]').selectOption('si');
  expect(await page.locator('select[name="bonusStatus"]').evaluate(e=>e.validity.valid)).toBe(false);
  await page.locator('select[name="supplyType"]').selectOption('gas');
  await page.locator('input[name="phone"]').fill('---------');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button',{name:'Comprobar formulario sin enviar',exact:true}).click();
  await expect(page.locator('main').getByRole('alert')).toContainText('Revisa el teléfono');
});

test('without JavaScript no personal fields can be submitted',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:3003/revision-factura-luz-gas');
  await expect(page.locator('input[name="name"]')).toBeDisabled();
  await expect(page.getByRole('button',{name:'Comprobar formulario sin enviar',exact:true})).toBeDisabled();
  await context.close();
});

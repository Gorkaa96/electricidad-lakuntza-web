import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Preview shows customer form with no examples and cannot submit before configuration',async({page},info)=>{
  await page.goto('/revision-factura-luz-gas');
  await expect(page.getByRole('link',{name:'Subir mi factura',exact:true})).toHaveAttribute('href','#formulario');
  await expect(page.locator('input[type="file"]')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toHaveValue('');
  await expect(page.locator('main')).not.toContainText('Prueba del formulario');
  await expect(page.getByRole('button',{name:/ejemplo|comprobar formulario/i})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Envío temporalmente no disponible',exact:true})).toBeDisabled();
  const writes=[];
  page.on('request',r=>{if(r.method()!=='GET') writes.push(r.method());});
  await page.locator('input[name="name"]').fill('Persona QA');
  await page.locator('input[name="name"]').press('Enter');
  expect(writes).toEqual([]);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
  await info.attach('customer invoice form',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('native form also keeps sending closed without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:3003/revision-factura-luz-gas');
  await expect(page.getByRole('button',{name:'Envío temporalmente no disponible',exact:true})).toBeDisabled();
  await expect(page.getByRole('button',{name:/ejemplo|comprobar formulario/i})).toHaveCount(0);
  await context.close();
});

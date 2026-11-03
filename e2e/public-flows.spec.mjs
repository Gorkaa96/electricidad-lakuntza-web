import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicPages = [
  '/', '/servicios', '/revision-factura-luz-gas?servicio=luz',
  '/revision-factura-luz-gas?servicio=gas', '/alarmas-movistar-prosegur',
  '/cargadores-electricos', '/asesoria-energetica', '/consulta',
  '/aviso-legal', '/privacidad', '/cookies',
];

for (const route of publicPages) {
  test('public route, responsive layout and accessibility: ' + route, async ({ page }, info) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await info.attach('screen', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    await info.attach('accessibility', { body: JSON.stringify(audit, null, 2), contentType: 'application/json' });
    expect(audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('four service priorities and keyboard skip link', async ({ page }) => {
  await page.goto('/');
  const expected = [
    '/revision-factura-luz-gas', '/alarmas-movistar-prosegur',
    '/cargadores-electricos', '/asesoria-energetica',
  ];
  const heading = page.getByRole('heading', { name: '¿En qué podemos ayudarte?', exact: true });
  const card = heading.locator('../..');
  const links = card.locator('a');
  await expect(links).toHaveCount(4);
  expect(await links.evaluateAll(items => items.map(a => a.getAttribute('href')))).toEqual(expected);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Ir al contenido', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contenido-principal$/);
});

test('navigation works at every viewport', async ({ page }, info) => {
  await page.goto('/');
  if (info.project.name !== 'desktop') {
    const button = page.getByRole('button', { name: 'Abrir menú', exact: true });
    await button.click();
    await expect(page.getByRole('button', { name: 'Cerrar menú', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
    await page.getByRole('navigation', { name: 'Navegación móvil', exact: true }).getByRole('link', { name: 'Cargadores eléctricos', exact: true }).click();
  } else {
    await page.getByRole('navigation', { name: 'Navegación principal', exact: true }).getByRole('link', { name: 'Cargadores eléctricos', exact: true }).click();
  }
  await expect(page).toHaveURL(/\/cargadores-electricos$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('public intake stays closed and confirmation cannot be forged by visiting URL', async ({ page }) => {
  for (const route of ['/consulta', '/revision-factura-luz-gas']) {
    await page.goto(route);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /enviar|solicitar revisión/i })).toHaveCount(0);
    expect(await page.locator('a[href^="https://wa.me/"]').count()).toBeGreaterThan(0);
  }
  await page.goto('/consulta/gracias');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('¿Quieres hacernos una consulta?');
  await page.goto('/revision-factura-luz-gas/gracias');
  await expect(page.locator('main')).toContainText('Para enviar tu factura');
});

test('hidden services and private routes remain protected', async ({ page, request }) => {
  for (const route of ['/servicios/instalaciones-electricas','/servicios/telecomunicaciones','/trabajos-realizados']) {
    expect((await request.get(route)).status()).toBe(404);
  }
  for (const route of ['/admin/oportunidades','/admin/usuarios','/admin/facturas']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole('heading', { name: 'Acceder al panel', exact: true })).toBeVisible();
  }
  const download = await request.get('/admin/facturas/11111111-1111-4111-8111-111111111111/archivo');
  expect(download.status()).toBe(401);
  expect(download.headers()['cache-control']).toContain('no-store');
  expect(await download.text()).toBe('Documento no disponible.');
});

test('preview indexing remains disabled', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  const response = await request.get('/');
  expect(await response.text()).toMatch(/noindex/);
});

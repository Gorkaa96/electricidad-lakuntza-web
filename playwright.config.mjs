import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  timeout: 45000,
  globalTimeout: 300000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },
  projects: [
    { name: 'desktop', testIgnore: '**/invoice-rehearsal.spec.mjs', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', testIgnore: '**/invoice-rehearsal.spec.mjs', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'tablet', testIgnore: '**/invoice-rehearsal.spec.mjs', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'invoice-preview', testMatch: '**/invoice-rehearsal.spec.mjs', use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:3003', viewport: {width:390,height:844} } },
  ],
  webServer: [{
    command: 'npm run start -- --hostname 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      VERCEL_ENV: 'production',
      INVOICE_INTAKE_ENABLED: 'false',
      PUBLIC_COMMERCIAL_INTAKE_ENABLED: 'false',
      NEXT_PUBLIC_PUBLICATION_ENABLED: 'false',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
    },
  }, {
    command: 'npm run start -- --hostname 127.0.0.1 --port 3003',
    url: 'http://127.0.0.1:3003',
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      VERCEL_ENV: 'preview',
      VERCEL_GIT_COMMIT_REF: 'integration/launch-prep-2026-10-29',
      INVOICE_INTAKE_ENABLED: 'false',
      PUBLIC_COMMERCIAL_INTAKE_ENABLED: 'false',
      NEXT_PUBLIC_PUBLICATION_ENABLED: 'false',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
    },
  }],
});

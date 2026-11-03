import {defineConfig} from '@playwright/test';
if(process.env.CI!=='true'||process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321')throw new Error('Disposable local backend only');
export default defineConfig({
  testDir:'./e2e-backend',workers:1,retries:0,timeout:60000,
  reporter:[['list'],['html',{outputFolder:'backend-report',open:'never'}]],
  use:{baseURL:'http://127.0.0.1:3002',viewport:{width:1440,height:1000},trace:'off',video:'off',screenshot:'only-on-failure'},
  webServer:{command:'npm run start -- --hostname 127.0.0.1 --port 3002',url:'http://127.0.0.1:3002',reuseExistingServer:false,timeout:60000,
    env:{INVOICE_INTAKE_ENABLED:'true',PUBLIC_COMMERCIAL_INTAKE_ENABLED:'true',NEXT_PUBLIC_PUBLICATION_ENABLED:'false'}},
});

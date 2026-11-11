// Test-only Node preload. Never imported by application code or deployed runtime.
import {appendFile} from 'node:fs/promises';
if(process.env.CI!=='true'||process.env.NEXT_PUBLIC_SUPABASE_URL!=='http://127.0.0.1:54321'||!process.env.QA_PROVIDER_EVENTS)throw new Error('Provider fixtures require the disposable runner');
const realFetch=globalThis.fetch;
let failNextMail=false;
globalThis.fetch=async(input,init={})=>{
  const url=new URL(typeof input==='string'||input instanceof URL?input:input.url);
  if(['127.0.0.1','localhost'].includes(url.hostname))return realFetch(input,init);
  if(url.href==='https://challenges.cloudflare.com/turnstile/v0/siteverify'){
    const params=new URLSearchParams(init.body);
    const token=params.get('response')||'';
    if(params.get('secret')!=='qa-unused-no-provider-access')throw new Error('Unexpected captcha credential');
    const success=['qa-invoice','qa-commercial','qa-invoice-mail-failure'].includes(token);
    failNextMail=token==='qa-invoice-mail-failure';
    await appendFile(process.env.QA_PROVIDER_EVENTS,JSON.stringify({kind:'captcha',success})+'\n');
    return Response.json({success,action:token==='qa-commercial'?'commercial_inquiry':'invoice_review',hostname:'127.0.0.1'});
  }
  if(url.href==='https://api.resend.com/emails'){
    if(new Headers(init.headers).get('authorization')!=='Bearer qa-unused-no-provider-access')throw new Error('Unexpected mail credential');
    const body=JSON.parse(init.body);
    const failed=failNextMail;failNextMail=false;
    await appendFile(process.env.QA_PROVIDER_EVENTS,JSON.stringify({kind:'mail',failed,attachments:body.attachments?.length||0,text:body.text,subject:body.subject})+'\n');
    return Response.json({id:'synthetic-notification'},{status:failed?503:202});
  }
  throw new Error('External network is prohibited in backend fixtures');
};

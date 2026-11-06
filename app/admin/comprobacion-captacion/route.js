import { getAdminContext } from '@/lib/admin';
import { createInvoiceIntakeClient } from '@/lib/supabase/intake';
export const dynamic = 'force-dynamic';
export async function GET() {
  const headers = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json' };
  if (process.env.VERCEL_ENV !== 'preview') return new Response('{}', {status:404,headers});
  const { user, admin } = await getAdminContext();
  if (!user || !admin || admin.role !== 'owner') return new Response('{}', {status:403,headers});
  const client = createInvoiceIntakeClient();
  if (!client) return Response.json({connection:false}, {status:503,headers});
  // Invalid fingerprint returns before any insert: this probe consumes no quota.
  const quota = await client.rpc('consume_public_intake_quota', {fingerprint:'health-check'});
  const leads = await client.from('invoice_review_leads').select('id', {head:true,count:'exact'});
  const bucket = await client.storage.getBucket('invoice-files');
  const checks = {quota:!quota.error && quota.data===false, database:!leads.error, privateStorage:!bucket.error && bucket.data?.public===false};
  return Response.json(checks,{status:Object.values(checks).every(Boolean)?200:503,headers});
}

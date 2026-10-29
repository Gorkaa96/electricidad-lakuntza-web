import 'server-only';
import { createClient } from '@supabase/supabase-js';

// This client is used ONLY by the validated server-side invoice intake action.
// Never export its credentials to NEXT_PUBLIC_* or a browser bundle.
export function createInvoiceIntakeClient() {
  if (process.env.INVOICE_INTAKE_ENABLED !== 'true') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serverKey) return null;

  return createClient(url, serverKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}

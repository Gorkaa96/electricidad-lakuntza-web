import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { commercialIntakeReady } from '@/lib/invoice/protection';

export function createCommercialIntakeClient() {
  if (!commercialIntakeReady()) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

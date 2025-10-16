import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using Service Role key. NEVER expose this to the client.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    throw new Error('Supabase env not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE are required');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

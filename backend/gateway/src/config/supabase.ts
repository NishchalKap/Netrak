import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the Service Role key.
 *
 * IMPORTANT:
 * - Keep `SUPABASE_SERVICE_ROLE_KEY` on the server only.
 * - This throws only when you actually call it (so the gateway can still boot without Supabase configured).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see backend/gateway/.env.example).'
    );
  }

  _supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return _supabaseAdmin;
}


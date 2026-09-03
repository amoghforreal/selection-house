import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Uses the service role key, bypasses Row Level Security entirely.
// ONLY use this in server-side API routes for privileged operations
// (marking orders as paid, recording payments), never expose this client
// to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

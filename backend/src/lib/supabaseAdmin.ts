import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  // Read env at call-time (ESM imports are hoisted; dotenv may load after module init)
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

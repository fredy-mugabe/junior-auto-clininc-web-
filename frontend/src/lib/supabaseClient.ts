import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

/**
 * Browser-side Supabase client (anon key).
 * Used for auth, public reads, and authenticated writes (RLS enforced).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

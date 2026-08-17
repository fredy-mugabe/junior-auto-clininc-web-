/** Maps PostgREST / Postgres errors from `.insert()` into a stable API JSON shape. */
export function insertFailureBody(err: { message: string; code?: string }) {
  const m = (err.message || '').toLowerCase()
  const rls =
    m.includes('row-level security') ||
    m.includes('violates row-level') ||
    m.includes('new row violates')
  const missing =
    m.includes('does not exist') ||
    err.code === '42P01' ||
    (m.includes('relation') && m.includes('does not exist'))
  const denied = m.includes('permission denied') || err.code === '42501'

  let hint: string
  if (rls) {
    hint =
      'Row Level Security blocked this insert. In Vercel → Environment Variables, set SUPABASE_SERVICE_ROLE_KEY to the service_role key from Supabase → Settings → API (not the anon / public key). Redeploy after saving.'
  } else if (missing) {
    hint =
      'Postgres could not use public.applications. In Supabase → SQL → New query, run docs/supabase-complete-setup.sql for the same project as SUPABASE_URL, then try again.'
  } else if (denied) {
    hint =
      'Permission denied. Confirm SUPABASE_SERVICE_ROLE_KEY is the service_role secret and that SUPABASE_URL is the matching Supabase project URL.'
  } else {
    hint = err.message
  }

  return {
    error: 'Could not save the application.',
    hint,
    code: err.code ?? null,
  }
}

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { AdminApplications } from '../components/AdminApplications'

export function AccountPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      setUser(sess?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    if (!supabase) return
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Signed out.')
    navigate('/login')
  }

  return (
    <main className="min-h-[calc(100svh-88px)] bg-brand-cream pt-24">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h1 className="text-3xl font-bold text-brand-green md:text-4xl">Account</h1>
          <p className="mt-2 text-lg text-brand-green-mid/90">
            Sign in to apply. Admins can review applications when authorized.
          </p>
        </motion.div>

        {!supabase && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Configure <code className="rounded bg-amber-100 px-1">.env</code> with Supabase keys to
            enable authentication.
          </p>
        )}

        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            className="mt-8 space-y-6 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg"
          >
            <p className="text-brand-green">
              Signed in as <strong>{user.email}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading || !supabase}
                className="rounded-xl border-2 border-brand-green bg-transparent px-6 py-2.5 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white disabled:opacity-50"
              >
                Log out
              </button>
              <Link
                to="/"
                className="rounded-xl bg-brand-yellow px-6 py-2.5 font-semibold text-brand-green shadow transition hover:bg-brand-yellow-deep"
              >
                Back to home
              </Link>
            </div>
            <AdminApplications session={session} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            className="mt-8 space-y-4 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg md:p-8"
          >
            <p className="text-brand-green">
              You’re not signed in yet. Please login or create an account.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-brand-yellow px-6 py-2.5 font-bold text-brand-green shadow transition hover:bg-brand-yellow-deep"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-brand-green px-6 py-2.5 font-bold text-white shadow transition hover:bg-brand-green-mid"
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}


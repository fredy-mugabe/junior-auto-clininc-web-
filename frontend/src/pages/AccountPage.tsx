import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { pageEnter } from '../lib/motion'
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
    <main className="min-h-[calc(100svh-88px)] bg-transparent pt-28 pb-10 md:pt-36 md:pb-12">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div {...pageEnter(0)}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Your profile</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-fg md:text-4xl">Account</h1>
          <p className="mt-3 text-lg leading-relaxed text-brand-fg-muted">
            Sign in to apply. Admins can review applications when authorized.
          </p>
        </motion.div>

        {!supabase && (
          <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-950/60 px-4 py-3 text-sm text-amber-100">
            Configure <code className="rounded bg-amber-900/80 px-1">.env</code> with Supabase keys to enable
            authentication.
          </p>
        )}

        {user ? (
          <motion.div
            {...pageEnter(0.06)}
            className="mt-8 space-y-6 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
          >
            <p className="text-brand-fg">
              Signed in as <strong>{user.email}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading || !supabase}
                className="rounded-full border-2 border-emerald-400/60 bg-transparent px-6 py-2.5 font-semibold text-brand-fg transition hover:bg-brand-green hover:text-white disabled:opacity-50"
              >
                Log out
              </button>
              <Link
                to="/"
                className="rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep px-6 py-2.5 font-semibold text-brand-green shadow-md transition hover:brightness-105"
              >
                Back to home
              </Link>
            </div>
            <AdminApplications session={session} />
          </motion.div>
        ) : (
          <motion.div
            {...pageEnter(0.06)}
            className="mt-8 space-y-4 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8"
          >
            <p className="text-brand-fg">
              You’re not signed in yet. Please login or create an account.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep px-6 py-2.5 font-bold text-brand-green shadow-md transition hover:brightness-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-green px-6 py-2.5 font-bold text-white shadow-lg shadow-brand-green/30 transition hover:bg-brand-green-mid"
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


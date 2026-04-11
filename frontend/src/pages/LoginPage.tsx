import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { pageEnter } from '../lib/motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function LoginPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setUser(sess?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      toast.error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Signed in.')
    setPassword('')
    navigate('/account')
  }

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
  }

  return (
    <main className="min-h-[calc(100svh-88px)] bg-transparent pt-28 pb-10 md:pt-36 md:pb-12">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div {...pageEnter(0)}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-fg md:text-4xl">Login</h1>
          <p className="mt-3 text-lg leading-relaxed text-brand-fg-muted">
            Sign in to apply and manage your account.
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
                onClick={() => navigate('/account')}
                className="rounded-full bg-brand-green px-6 py-2.5 font-semibold text-white shadow-md shadow-brand-green/25 transition hover:bg-brand-green-mid"
              >
                Go to account
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading || !supabase}
                className="rounded-full border-2 border-emerald-400/60 bg-transparent px-6 py-2.5 font-semibold text-brand-fg transition hover:bg-brand-green hover:text-white disabled:opacity-50"
              >
                Log out
              </button>
            </div>
            <p className="text-sm text-brand-fg-muted">
              Not you? Log out, then sign in with a different email.
            </p>
          </motion.div>
        ) : (
          <motion.form
            {...pageEnter(0.05)}
            onSubmit={handleLogin}
            className="mt-8 space-y-4 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8"
          >
            <div>
              <label htmlFor="login-email" className="text-sm font-semibold text-emerald-200">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-semibold text-emerald-200">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep py-3.5 font-bold text-brand-green shadow-[0_10px_30px_-10px_rgba(180,130,20,0.45)] transition hover:brightness-105 disabled:opacity-50"
            >
              {loading ? '…' : 'Log in'}
            </button>
            <p className="pt-1 text-center text-sm text-brand-fg-muted">
              No account?{' '}
              <Link
                to="/register"
                className="font-semibold text-emerald-300 underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-fg"
              >
                Create one
              </Link>
            </p>
          </motion.form>
        )}
      </div>
    </main>
  )
}


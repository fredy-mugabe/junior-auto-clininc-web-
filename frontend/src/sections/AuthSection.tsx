import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { sectionReveal } from '../lib/motion'
import { toast } from 'sonner'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { AdminApplications } from '../components/AdminApplications'

export function AuthSection() {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      toast.error('Supabase is not configured.')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email: email.trim(), password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Check your email to confirm your account if required.')
    setPassword('')
    setConfirm('')
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
    <section id="auth" className="scroll-mt-24 bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div {...sectionReveal(0)}>
          <h2 className="text-3xl font-bold text-brand-fg md:text-4xl">Account</h2>
          <p className="mt-2 text-lg text-brand-fg-muted">
            Log in or create an account. Admins can review job applications below when authorized.
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
            {...sectionReveal(0.06)}
            className="mt-8 space-y-6 rounded-2xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-lg"
          >
            <p className="text-brand-fg">
              Signed in as <strong>{user.email}</strong>
            </p>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading || !supabase}
              className="rounded-xl border-2 border-emerald-400/60 bg-transparent px-6 py-2.5 font-semibold text-brand-fg transition hover:bg-brand-green hover:text-white disabled:opacity-50"
            >
              Log out
            </button>
            <AdminApplications session={session} />
          </motion.div>
        ) : (
          <motion.div
            {...sectionReveal(0.05)}
            className="mt-8 rounded-2xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-lg md:p-8"
          >
            <div className="flex gap-2 rounded-xl bg-emerald-950/90 p-1 ring-1 ring-emerald-500/20">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  tab === 'login'
                    ? 'bg-brand-green text-white shadow'
                    : 'text-brand-fg-muted hover:text-brand-fg'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 rounded-lg py-2 text-sm font-bold transition ${
                  tab === 'register'
                    ? 'bg-brand-green text-white shadow'
                    : 'text-brand-fg-muted hover:text-brand-fg'
                }`}
              >
                Register
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                    className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none ring-emerald-500/20 focus:ring-2 focus:ring-brand-yellow/40"
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
                    className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none ring-emerald-500/20 focus:ring-2 focus:ring-brand-yellow/40"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !supabase}
                  className="w-full rounded-xl bg-brand-yellow py-3 font-bold text-brand-green shadow transition hover:bg-brand-yellow-deep disabled:opacity-50"
                >
                  {loading ? '…' : 'Log in'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="reg-email" className="text-sm font-semibold text-emerald-200">
                    Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none ring-emerald-500/20 focus:ring-2 focus:ring-brand-yellow/40"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="text-sm font-semibold text-emerald-200">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none ring-emerald-500/20 focus:ring-2 focus:ring-brand-yellow/40"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm" className="text-sm font-semibold text-emerald-200">
                    Confirm password
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-brand-fg outline-none ring-emerald-500/20 focus:ring-2 focus:ring-brand-yellow/40"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !supabase}
                  className="w-full rounded-xl bg-brand-green py-3 font-bold text-white shadow transition hover:bg-brand-green-mid disabled:opacity-50"
                >
                  {loading ? '…' : 'Create account'}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}


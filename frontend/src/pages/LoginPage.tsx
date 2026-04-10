import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
    <main className="min-h-[calc(100svh-88px)] bg-brand-cream pt-24">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h1 className="text-3xl font-bold text-brand-green md:text-4xl">Login</h1>
          <p className="mt-2 text-lg text-brand-green-mid/90">
            Sign in to apply and manage your account.
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-8 space-y-6 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg"
          >
            <p className="text-brand-green">
              Signed in as <strong>{user.email}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/account')}
                className="rounded-xl bg-brand-green px-6 py-2.5 font-semibold text-white transition hover:bg-brand-green-mid"
              >
                Go to account
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading || !supabase}
                className="rounded-xl border-2 border-brand-green bg-transparent px-6 py-2.5 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white disabled:opacity-50"
              >
                Log out
              </button>
            </div>
            <p className="text-sm text-brand-green/80">
              Not you? Log out, then sign in with a different email.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            onSubmit={handleLogin}
            className="mt-8 space-y-4 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg md:p-8"
          >
            <div>
              <label htmlFor="login-email" className="text-sm font-semibold text-brand-green">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 px-4 py-3 outline-none ring-brand-green/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="text-sm font-semibold text-brand-green">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 px-4 py-3 outline-none ring-brand-green/30 focus:ring-2"
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
            <p className="pt-1 text-center text-sm text-brand-green/80">
              No account?{' '}
              <Link
                to="/register"
                className="font-semibold text-brand-green underline decoration-brand-yellow decoration-2 underline-offset-4"
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


import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { pageEnter } from '../lib/motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function RegisterPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => setUser(sess?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      toast.error('Supabase is not configured.')
      return
    }
    if (fullName.trim().length < 2) {
      toast.error('Please enter your full name.')
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
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      toast.error('This email is already registered. Please login instead.')
      return
    }
    if (data.session) {
      toast.success('Account created. You are now signed in.')
      navigate('/account')
      return
    }
    toast.success('Account created. Check your email for the confirmation link.')
    setFullName('')
    setPassword('')
    setConfirm('')
    navigate('/login')
  }

  return (
    <main className="min-h-[calc(100svh-88px)] bg-transparent pt-28 pb-10 md:pt-36 md:pb-12">
      <div className="mx-auto max-w-lg px-4 md:px-6">
        <motion.div {...pageEnter(0)}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Join us</p>
          <h1 className="mt-2 text-3xl font-bold text-brand-fg md:text-4xl">Register</h1>
          <p className="mt-3 text-lg leading-relaxed text-brand-fg-muted">
            Create an account to apply and save time.
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
            className="mt-8 space-y-4 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
          >
            <p className="text-brand-fg">
              You’re already signed in as <strong>{user.email}</strong>.
            </p>
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="rounded-full bg-brand-green px-6 py-2.5 font-semibold text-white shadow-md shadow-brand-green/25 transition hover:bg-brand-green-mid"
            >
              Go to account
            </button>
          </motion.div>
        ) : (
          <motion.form
            {...pageEnter(0.05)}
            onSubmit={handleRegister}
            className="mt-8 space-y-4 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8"
          >
            <div>
              <label htmlFor="reg-full-name" className="text-sm font-semibold text-emerald-200">
                Full name
              </label>
              <input
                id="reg-full-name"
                name="name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your first and last name"
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-900 px-4 py-3 text-emerald-50 placeholder:text-brand-fg-muted/55 caret-emerald-200 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
                minLength={2}
              />
            </div>
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
                placeholder="you@example.com"
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-900 px-4 py-3 text-emerald-50 placeholder:text-brand-fg-muted/55 caret-emerald-200 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
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
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-900 px-4 py-3 text-emerald-50 placeholder:text-brand-fg-muted/55 caret-emerald-200 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
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
                className="mt-1 w-full rounded-2xl border border-emerald-500/30 bg-emerald-900 px-4 py-3 text-emerald-50 placeholder:text-brand-fg-muted/55 caret-emerald-200 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full rounded-full bg-brand-green py-3.5 font-bold text-white shadow-[0_12px_32px_-12px_rgba(20,83,45,0.45)] transition hover:bg-brand-green-mid disabled:opacity-50"
            >
              {loading ? '…' : 'Create account'}
            </button>
            <p className="pt-1 text-center text-sm text-brand-fg-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-300 underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-fg"
              >
                Log in
              </Link>
            </p>
          </motion.form>
        )}
      </div>
    </main>
  )
}


import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

export function RegisterPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
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
    setPassword('')
    setConfirm('')
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
          <h1 className="text-3xl font-bold text-brand-green md:text-4xl">Register</h1>
          <p className="mt-2 text-lg text-brand-green-mid/90">Create an account to apply and save time.</p>
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
            className="mt-8 space-y-4 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg"
          >
            <p className="text-brand-green">
              You’re already signed in as <strong>{user.email}</strong>.
            </p>
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="rounded-xl bg-brand-green px-6 py-2.5 font-semibold text-white transition hover:bg-brand-green-mid"
            >
              Go to account
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            onSubmit={handleRegister}
            className="mt-8 space-y-4 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg md:p-8"
          >
            <div>
              <label htmlFor="reg-email" className="text-sm font-semibold text-brand-green">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 px-4 py-3 outline-none ring-brand-green/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="text-sm font-semibold text-brand-green">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 px-4 py-3 outline-none ring-brand-green/30 focus:ring-2"
                required
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="reg-confirm" className="text-sm font-semibold text-brand-green">
                Confirm password
              </label>
              <input
                id="reg-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 px-4 py-3 outline-none ring-brand-green/30 focus:ring-2"
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
            <p className="pt-1 text-center text-sm text-brand-green/80">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-brand-green underline decoration-brand-yellow decoration-2 underline-offset-4"
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


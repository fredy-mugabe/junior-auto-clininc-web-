import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { getApiUrl } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'

type ApplyType = 'internship' | 'job'

export function ApplySection() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<ApplyType>('internship')
  const [message, setMessage] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess))
    return () => subscription.unsubscribe()
  }, [])

  function validate(): string | null {
    if (fullName.trim().length < 2) return 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email.'
    if (phone.trim().length < 6) return 'Please enter a valid phone number.'
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) {
      toast.error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }
    if (!session?.access_token) {
      toast.error('Please login before applying.')
      navigate('/login')
      return
    }
    const err = validate()
    if (err) {
      toast.error(err)
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.set('full_name', fullName.trim())
      form.set('email', email.trim())
      form.set('phone', phone.trim())
      form.set('type', type)
      if (message.trim()) form.set('message', message.trim())
      if (cvFile) form.set('cv', cvFile)

      const res = await fetch(`${getApiUrl()}/api/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: form,
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        errors?: Array<{ msg?: string }>
      }
      if (!res.ok) {
        const firstVal =
          Array.isArray(data.errors) && data.errors[0]?.msg
            ? data.errors[0].msg
            : null
        toast.error(
          typeof data.error === 'string'
            ? data.error
            : firstVal ?? 'Could not submit. Please try again.',
        )
        return
      }
      toast.success('Application sent successfully.')
      setFullName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setType('internship')
      setCvFile(null)
    } catch {
      toast.error('Network error. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="apply" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-brand-green md:text-4xl">Apply</h2>
          <p className="mt-2 text-lg text-brand-green-mid/90">
            Send your interest for an internship or a job. We will get back to you.
          </p>
        </motion.div>

        {!session?.access_token ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="mt-10 rounded-2xl border border-brand-green/10 bg-brand-cream/80 p-6 shadow-lg md:p-8"
          >
            <p className="text-brand-green">
              <strong>Account required:</strong> please create an account or login before applying.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 rounded-xl bg-brand-green px-6 py-3 font-bold text-white shadow transition hover:bg-brand-green-mid"
            >
              Go to login / register
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 }}
            onSubmit={onSubmit}
            className="mt-10 space-y-5 rounded-2xl border border-brand-green/10 bg-brand-cream/80 p-6 shadow-lg md:p-8"
          >
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold text-brand-green">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-brand-green outline-none ring-brand-green/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-green">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-brand-green outline-none ring-brand-green/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-brand-green">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-brand-green outline-none ring-brand-green/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-brand-green">
                Applying for
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value as ApplyType)}
                className="mt-1 w-full rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-brand-green outline-none ring-brand-green/30 focus:ring-2"
              >
                <option value="internship">Internship</option>
                <option value="job">Job</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-brand-green">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience or availability…"
                className="mt-1 w-full resize-y rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-brand-green outline-none ring-brand-green/30 focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-semibold text-brand-green">
                Attach CV (PDF/DOC/DOCX)
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full cursor-pointer rounded-xl border border-brand-green/20 bg-white px-4 py-3 text-sm text-brand-green file:mr-4 file:rounded-lg file:border-0 file:bg-brand-cream file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-green hover:file:bg-brand-yellow/30"
              />
              <p className="mt-2 text-xs text-brand-green/70">Max size 8MB.</p>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-green px-6 py-3.5 font-bold text-white shadow-lg transition hover:bg-brand-green-mid disabled:opacity-60"
            >
              {loading && (
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
              )}
              {loading ? 'Submitting…' : 'Submit application'}
            </motion.button>
          </motion.form>
        )}
      </div>
    </section>
  )
}

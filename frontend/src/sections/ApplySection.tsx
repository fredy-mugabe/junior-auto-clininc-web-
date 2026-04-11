import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { sectionReveal, spring, tapSquish } from '../lib/motion'
import { toast } from 'sonner'
import { getApiUrl } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { SectionFrame } from '../components/SectionFrame'

const APPLY_BG = '/stock/section-services-bg.jpg'

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
    <SectionFrame id="apply" bgUrl={APPLY_BG} maxWidth="5xl">
      <div className="mx-auto max-w-2xl">
        <motion.div
          {...sectionReveal(0)}
          className="max-w-2xl rounded-3xl border border-emerald-500/25 bg-emerald-950/85 px-6 py-6 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-8 md:py-7"
        >
          <p className="font-sans text-sm font-bold uppercase tracking-[0.22em] text-emerald-400">
            Careers
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand-fg drop-shadow-sm md:text-[2.35rem] md:leading-tight">
            Apply
          </h2>
          <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-brand-fg/95 md:text-xl">
            Send your interest for an internship or a job — we’ll get back to you soon.
          </p>
        </motion.div>

        {!session?.access_token ? (
          <motion.div
            {...sectionReveal(0.08)}
            className="mt-10 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8"
          >
            <p className="text-base font-medium leading-relaxed text-brand-fg/95">
              <strong className="font-semibold text-brand-fg">Account required:</strong> please create an account or log
              in before applying.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep px-8 py-3.5 text-base font-bold text-brand-green shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)] transition hover:brightness-105"
            >
              Go to login / register
            </button>
          </motion.div>
        ) : (
          <motion.form
            {...sectionReveal(0.06)}
            onSubmit={onSubmit}
            className="mt-10 space-y-5 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 p-6 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8"
          >
            <div>
              <label htmlFor="full_name" className="block text-sm font-bold text-emerald-200">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg placeholder:text-brand-fg-muted/50 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-emerald-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg placeholder:text-brand-fg-muted/50 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-emerald-200">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg placeholder:text-brand-fg-muted/50 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-bold text-emerald-200">
                Applying for
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value as ApplyType)}
                className="mt-1.5 w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
              >
                <option value="internship">Internship</option>
                <option value="job">Job</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-emerald-200">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience or availability…"
                className="mt-1.5 w-full resize-y rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg placeholder:text-brand-fg-muted/50 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-brand-yellow/40"
              />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-bold text-emerald-200">
                Attach CV (PDF/DOC/DOCX)
              </label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                className="mt-1.5 block w-full cursor-pointer rounded-2xl border border-emerald-500/30 bg-emerald-950/80 px-4 py-3 text-base font-medium text-brand-fg file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-800 file:px-4 file:py-2 file:text-sm file:font-bold file:text-brand-fg hover:file:bg-emerald-700"
              />
              <p className="mt-2 text-sm font-medium text-brand-fg-muted">Max size 8MB.</p>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? undefined : { scale: 1.02, transition: spring.snappy }}
              whileTap={loading ? undefined : tapSquish}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep px-8 py-3.5 text-base font-bold text-brand-green shadow-[0_12px_30px_-8px_rgba(0,0,0,0.25)] transition hover:brightness-105 disabled:opacity-60"
            >
              {loading && (
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-green border-t-transparent"
                  aria-hidden
                />
              )}
              {loading ? 'Submitting…' : 'Submit application'}
            </motion.button>
          </motion.form>
        )}
      </div>
    </SectionFrame>
  )
}

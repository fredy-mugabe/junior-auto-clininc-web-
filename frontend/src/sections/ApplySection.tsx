import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { IconClipboard } from '../components/ClassicIcons'
import { COMPANY_LEGAL, getApiUrl } from '../lib/constants'

type ApplyType = 'internship' | 'job'

export function ApplySection() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<ApplyType>('internship')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function validate(): string | null {
    if (fullName.trim().length < 2) return 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email.'
    if (phone.trim().length < 6) return 'Please enter a valid phone number.'
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) {
      toast.error(err)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl()}/api/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          type,
          message: message.trim() || undefined,
        }),
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
    } catch {
      toast.error('Network error. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  const field =
    'mt-1 w-full rounded-xl border border-emerald-500/30 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none ring-emerald-500/30 focus:ring-2'

  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F4D03F]/35 text-[#F4D03F]">
              <IconClipboard className="h-6 w-6" />
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Application form</h2>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-white/88">
            Use this form to introduce yourself for an internship or a professional role at {COMPANY_LEGAL}.
            Include relevant training, tools you are comfortable with, and availability — the more
            specific you are, the faster we can match you to the right conversation.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/82 md:text-lg">
            We review submissions during business hours. If your background fits an open need, you will
            hear from us with next steps; if not, we may keep your details on file for future openings.
            Honest, complete applications are always easier to assess than one-line messages.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          onSubmit={onSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-emerald-500/25 bg-[#051616]/92 p-6 shadow-xl md:p-8"
        >
          <div>
            <label htmlFor="full_name" className="block text-sm font-semibold text-white/90">
              Full name
            </label>
            <input
              id="full_name"
              name="full_name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={field}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white/90">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-white/90">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={field}
              required
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-white/90">
              Applying for
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as ApplyType)}
              className={field}
            >
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-white/90">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience or availability..."
              className={field}
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="jac-btn jac-btn--primary w-full gap-2 !rounded-2xl px-6 py-3.5 disabled:opacity-60"
          >
            {loading && (
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"
                aria-hidden
              />
            )}
            {loading ? 'Submitting...' : 'Submit application'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}

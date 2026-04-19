import { motion } from 'framer-motion'
import { IconClock, IconMail, IconMapPin, IconPhone } from '../components/ClassicIcons'
import { COMPANY_LEGAL, EMAIL, PHONES } from '../lib/constants'

export function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden rounded-none px-4 py-16 md:px-8 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#051616] via-[#08221e] to-[#051616]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]">Contact</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Contact & support
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/92 md:text-xl">
            Reach out for service bookings, diagnostics questions, fleet partnerships, or career information.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
            For the fastest reply, call during opening hours or email with your vehicle details in the
            subject line. If you are coordinating a fleet, mention approximate unit count and whether you
            need on-site pickup or workshop-only service.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-7 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4D03F]/35 text-[#F4D03F]">
                <IconPhone className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Workshop contacts</h2>
            </div>
            <p className="mt-4 leading-relaxed text-white/88">
              Use the details below for general enquiries, booking requests, and follow-up after a visit.
              When you email, include your vehicle make and model plus a short description of the issue —
              it helps us route your message faster.
            </p>
            <p className="mt-4 font-semibold text-white">{COMPANY_LEGAL}</p>
            <p className="mt-3 flex items-center gap-2 text-white/85">
              <IconMail className="h-4 w-4 shrink-0 text-[#F4D03F]" />
              <span>
                Email:{' '}
                <a href={`mailto:${EMAIL}`} className="text-[#F4D03F] underline-offset-2 hover:underline">
                  {EMAIL}
                </a>
              </span>
            </p>
            <div className="mt-3 space-y-1 text-white/85">
              {PHONES.map((phone) => (
                <p key={phone}>
                  Phone:{' '}
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="text-[#F4D03F] underline-offset-2 hover:underline"
                  >
                    {phone}
                  </a>
                </p>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-7 shadow-xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4D03F]/35 text-[#F4D03F]">
                <IconClock className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Hours & response</h2>
            </div>
            <p className="mt-4 leading-relaxed text-white/88">
              Regular hours are listed below; outside those times we may still offer limited emergency
              support depending on capacity. For non-urgent questions, email often gets you a written
              record you can refer to later.
            </p>
            <p className="mt-4 text-white/85">Monday - Saturday: 07:30 - 19:00</p>
            <p className="mt-2 text-white/85">Sunday: Emergency support only</p>
            <p className="mt-4 leading-relaxed text-white/85">
              Typical email response time: within two business hours during workshop operating time. If you
              do not hear back, please call — occasionally messages are filtered or require an attachment
              you               forgot to include.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-7 shadow-xl backdrop-blur-md md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#F4D03F]/35 text-[#F4D03F]">
                <IconMapPin className="h-5 w-5" />
              </span>
              <h2 className="text-2xl font-bold text-white">Visit Musanze</h2>
            </div>
            <p className="mt-4 leading-relaxed text-white/88">
              The workshop is based in Musanze with convenient access for northern corridor drivers. Use the
              map on our About page for live directions, or call if you need escorted entry for a wide
              vehicle.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/78">
              Parking is arranged so inspection lanes stay clear — please follow staff guidance when you
              arrive so we can keep the yard safe for pedestrians and heavy equipment.
            </p>
          </motion.article>
        </div>
      </section>
    </>
  )
}

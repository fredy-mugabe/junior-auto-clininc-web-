import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { COMPANY_LEGAL, EMAIL, getPublicSiteUrl, PHONES } from '../lib/constants'

function phoneToE164Rw(local: string): string {
  const digits = local.replace(/\D/g, '')
  if (digits.startsWith('250')) return `+${digits}`
  if (digits.startsWith('0')) return `+250${digits.slice(1)}`
  return `+250${digits}`
}

const explore = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Footer() {
  const structuredData = useMemo(() => {
    const url = getPublicSiteUrl()
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: COMPANY_LEGAL,
      url,
      telephone: phoneToE164Rw(PHONES[0]),
      email: EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Musanze',
        addressRegion: 'Northern Province',
        addressCountry: 'RW',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '07:30',
          closes: '19:00',
        },
      ],
      description:
        'Automotive diagnostics, mechanical repair, maintenance, and technician training in Musanze, Rwanda.',
      areaServed: { '@type': 'City', name: 'Musanze' },
    })
  }, [])

  return (
    <footer className="relative px-3 pb-6 pt-2 md:px-8 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
        className="jac-footer mx-auto max-w-[min(100%,1980px)] overflow-hidden rounded-t-[1.85rem] border border-[#F4D03F]/20 shadow-[0_-12px_48px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06] md:rounded-t-[2.35rem]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(244,208,63,0.08),transparent_55%)]"
          aria-hidden
        />
        <div className="relative py-10 text-white md:py-12">
          <div className="mx-auto grid max-w-[min(100%,1980px)] gap-10 px-4 md:grid-cols-12 md:gap-8 md:px-8 lg:px-10">
            <motion.div
              className="md:col-span-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <img
                src="/branding/logo-contact-strip.png"
                alt={`${COMPANY_LEGAL} contact information`}
                className="h-auto w-full max-w-[260px] object-contain object-left drop-shadow-md"
              />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D03F]/95">
                Precision automotive care
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
                Search-friendly summary: {COMPANY_LEGAL} is an automotive workshop in Musanze offering car
                diagnostics, engine repair, brake and suspension service, scheduled maintenance, fleet support,
                and internship pathways — with clear estimates and documented handovers.
              </p>
            </motion.div>

            <motion.div
              className="md:col-span-5"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]">Explore the site</p>
              <nav aria-label="Site pages" className="mt-4 flex flex-wrap gap-2">
                {explore.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                className={({ isActive }) =>
                  [
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                    isActive
                      ? 'border-white/35 bg-white/[0.12] text-white'
                      : 'border-white/15 text-white/75 hover:border-white/30 hover:bg-white/[0.06] hover:text-white',
                  ].join(' ')
                }
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
              <p className="mt-5 text-sm leading-relaxed text-white/78">
                Keywords people use when choosing a garage:{' '}
                <span className="text-white/90">
                  Musanze car repair, OBD diagnostics Rwanda, genuine parts mindset, brake service, oil change,
                  suspension alignment, fleet maintenance Musanze, workshop internship Rwanda, trusted mechanic
                  Musanze
                </span>
                . Content on each page expands on how we deliver those services safely and transparently.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3 border-t border-white/10 pt-8 text-sm leading-relaxed md:col-span-3 md:border-t-0 md:border-l md:border-white/10 md:pt-0 md:pl-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D03F]/90">Registered business</p>
              <p className="font-semibold text-white">{COMPANY_LEGAL}</p>
              <p>
                <span className="font-semibold text-[#F4D03F]/90">Phone:</span>{' '}
                <a href={`tel:${PHONES[0]}`} className="underline-offset-2 hover:underline">
                  {PHONES[0]}
                </a>
              </p>
              <p className="break-words">
                <span className="font-semibold text-[#F4D03F]/90">Email:</span>{' '}
                <a href={`mailto:${EMAIL}`} className="underline-offset-2 hover:underline">
                  {EMAIL}
                </a>
              </p>
              <p className="text-white/75">
                <span className="font-semibold text-[#F4D03F]/90">Hours:</span> Mon–Sat, 07:30 – 19:00
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mx-auto mt-8 max-w-[min(100%,1980px)] border-t border-white/12 px-4 pt-6 text-center text-xs text-white/55 md:px-8 lg:px-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.45 }}
          >
            <p>
              © {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.
              {import.meta.env.VITE_GIT_SHA ? (
                <span
                  className="block pt-2 font-mono text-[0.65rem] text-white/35"
                  title="Git commit deployed on Vercel. Compare with GitHub; if the site looks old, open the latest deployment log or reconnect the Git integration."
                >
                  Build {import.meta.env.VITE_GIT_SHA.slice(0, 7)}
                </span>
              ) : null}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

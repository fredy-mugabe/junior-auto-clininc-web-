import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { COMPANY_LEGAL, EMAIL, getPublicSiteUrl, PHONES, TIN } from '../lib/constants'

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
    <footer className="jac-footer border-t border-[#F4D03F]/25 py-10 text-white md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <div className="mx-auto grid max-w-[min(100%,1980px)] gap-10 px-4 md:grid-cols-12 md:gap-8 md:px-8 lg:px-10">
        <div className="md:col-span-4">
          <img
            src="/branding/logo-contact-strip.png"
            alt={`${COMPANY_LEGAL} contact information`}
            className="h-auto w-full max-w-[260px] object-contain object-left"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D03F]/95">
            Precision automotive care
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
            Search-friendly summary: {COMPANY_LEGAL} is an automotive workshop in Musanze offering car
            diagnostics, engine repair, brake and suspension service, scheduled maintenance, fleet support,
            and internship pathways — with clear estimates and documented handovers.
          </p>
        </div>

        <div className="md:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]">Explore the site</p>
          <nav aria-label="Site pages" className="mt-4 flex flex-wrap gap-2">
            {explore.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                    isActive
                      ? 'border-[#F4D03F] bg-[#F4D03F] text-black'
                      : 'border-white/20 text-white/90 hover:border-[#F4D03F]/70 hover:text-[#F4D03F]',
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
        </div>

        <div className="space-y-3 border-t border-white/10 pt-8 text-sm leading-relaxed md:col-span-3 md:border-t-0 md:border-l md:border-white/10 md:pt-0 md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D03F]/90">Registered business</p>
          <p className="font-semibold text-white">{COMPANY_LEGAL}</p>
          <p>
            <span className="font-semibold text-[#F4D03F]/90">TIN:</span> {TIN}
          </p>
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
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[min(100%,1980px)] border-t border-white/12 px-4 pt-6 text-center text-xs text-white/55 md:px-8 lg:px-10">
        <p>© {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.</p>
      </div>
    </footer>
  )
}

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COMPANY_LEGAL } from '../lib/constants'
import { heroContainer, heroHeadline, heroItem, heroSubline, listContainer, listItem, sectionReveal } from '../lib/motion'
import {
  IconGauge,
  IconWrench,
  IconEngine,
  IconTruck,
  IconShield,
  IconClipboard,
  IconAward,
  IconUsers,
} from '../components/ClassicIcons'
import { GALLERY_SEED_IMAGES } from '../lib/gallerySeed'

/** Full-bleed slideshow — your workshop & facility photography + reference atmosphere slide */
/** Workshop photography only — do not use template/stock hero screenshots with foreign branding or text. */
const SLIDES = [
  '/site/home-hero-slide-1.png',
  '/site/home-hero-slide-2.png',
  '/site/home-hero-slide-3.png',
] as const

const trustPoints = [
  'Evidence-based diagnostics before parts are ordered',
  'Musanze workshop with organized bays and tooling',
  'Written findings and calm, professional handovers',
] as const

const stats = [
  { value: 'Mon–Sat', label: 'Workshop hours' },
  { value: 'Musanze', label: 'Northern Rwanda' },
  { value: 'Full service', label: 'Diagnostics to handover' },
] as const

/** Live-status style readout under the hero — workshop equivalent of a systems dashboard. */
const statusReadouts = [
  { label: 'BAYS ACTIVE', value: '6 / 6', note: 'Full capacity today' },
  { label: 'DIAGNOSTIC SYNC', value: 'OK', note: 'Toyota-grade scan tools' },
  { label: 'PARTS PIPELINE', value: 'LIVE', note: 'Genuine parts on order' },
  { label: 'TOYOTA STATUS', value: 'AUTHORIZED', note: 'Musanze service center' },
] as const

const coreServices = [
  {
    name: 'Diagnostics & Scanning',
    detail: 'Computerized fault-finding before any part is touched — no guesswork billing.',
    Icon: IconGauge,
  },
  {
    name: 'Engine & Drivetrain',
    detail: 'From rough idling to full rebuilds, tracked against manufacturer specification.',
    Icon: IconEngine,
  },
  {
    name: 'General Repairs',
    detail: 'Brakes, suspension, electrical, cooling — handled by trained technicians.',
    Icon: IconWrench,
  },
  {
    name: 'Fleet & Business',
    detail: 'Scheduled maintenance cycles and documented history for commercial vehicles.',
    Icon: IconTruck,
  },
] as const

const proofPoints = [
  {
    title: 'Toyota Rwanda Authorized',
    detail: 'Officially partnered as a Toyota Rwanda authorized service center in Musanze — genuine parts, factory-grade standards.',
    Icon: IconShield,
  },
  {
    title: 'Written findings, every time',
    detail: 'Every diagnosis comes with a documented report — what we found, what it costs, and what can wait.',
    Icon: IconClipboard,
  },
  {
    title: 'Trained, uniformed technicians',
    detail: 'A dedicated Musanze workshop team, trained to Toyota Global Standard service procedures.',
    Icon: IconAward,
  },
] as const

export function HomePage() {
  const navigate = useNavigate()
  const loopSlides = [...SLIDES, ...SLIDES]
  const featuredPartnershipPhoto = GALLERY_SEED_IMAGES.find((img) => img.featured) ?? GALLERY_SEED_IMAGES[0]

  return (
    <>
    <section className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden rounded-none">
      {/* Slideshow film strip */}
      <div className="home-slider-track pointer-events-none absolute inset-0 z-0">
        {loopSlides.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt=""
            className="h-full w-[100vw] shrink-0 object-cover object-center"
            width={1920}
            height={1080}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>

      {/* Stronger stacked overlays — readability first */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/88 via-[#051616]/78 to-black/88" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-[#041312]/45 to-[#020807]/96" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-transparent to-black/65" aria-hidden />
      <div className="hero-bokeh absolute inset-0 z-[1]" aria-hidden />
      <div
        className="absolute inset-0 z-[1] shadow-[inset_0_0_280px_rgba(0,0,0,0.65)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[100dvh] flex-1 flex-col px-6 pb-14 pt-[6.25rem] sm:px-10 sm:pb-16 sm:pt-32 md:px-14 md:pt-36 lg:px-20">
        <motion.div
          className="mx-auto flex w-full max-w-[58rem] flex-1 flex-col items-center justify-center text-center"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={heroItem}
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-white/15 bg-black/45 px-5 py-3 text-xs font-medium tracking-wide text-white/95 shadow-lg backdrop-blur-md sm:text-sm"
          >
            <span className="inline-flex items-center gap-2 text-[#F4D03F]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F4D03F]" aria-hidden />
              Diagnostics &amp; repair
            </span>
            <span className="hidden text-white/35 sm:inline" aria-hidden>
              •
            </span>
            <span>Musanze workshop</span>
            <span className="text-white/35" aria-hidden>
              •
            </span>
            <span>Professional standards</span>
          </motion.div>

          <motion.h1
            variants={heroHeadline}
            className="mt-10 max-w-5xl font-sans text-[2.65rem] leading-[1.08] font-black tracking-[-0.02em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:text-[3.5rem] md:text-[4.1rem] lg:text-[4.75rem] lg:leading-[1.02]"
          >
            <span className="block text-white">Automotive Solutions</span>
            <span className="mt-1.5 block text-white">
              That Drive{' '}
              <span className="text-[#2f8a62] drop-shadow-none">Reliable</span>{' '}
              <span className="text-[#d4a93c] drop-shadow-none">Performance</span>
            </span>
          </motion.h1>

          <motion.p
            variants={heroSubline}
            className="mt-10 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl md:text-[1.28rem]"
          >
            {COMPANY_LEGAL} welcomes you to a full-service garage where modern diagnostics, careful
            mechanical work, and straight answers come standard — whether you need a warning light
            investigated, a long trip checked, or a fleet kept dependable.
          </motion.p>

          <motion.ul
            variants={heroItem}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-3"
          >
            {trustPoints.map((line) => (
              <li key={line} className="flex items-center gap-2.5 text-sm font-medium text-white/95 md:text-base">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-950/80 text-emerald-300"
                  aria-hidden
                >
                  ✓
                </span>
                {line}
              </li>
            ))}
          </motion.ul>

          <motion.div
            variants={heroItem}
            className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-12"
          >
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="jac-btn jac-btn--primary min-h-[3.25rem] px-10 md:min-h-[3.5rem] md:px-12"
            >
              Explore services
              <span className="ml-1" aria-hidden>
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="jac-btn jac-btn--secondary min-h-[3.25rem] px-10 md:min-h-[3.5rem] md:px-12"
            >
              Contact the workshop
            </button>
          </motion.div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 sm:mt-24 sm:grid-cols-3 sm:gap-8"
        >
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/20 bg-white/[0.12] px-7 py-6 text-center shadow-[0_16px_48px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md"
            >
              <p className="font-display-classic text-3xl font-semibold text-white md:text-[2rem]">{value}</p>
              <p className="mt-1.5 text-sm font-medium text-white/75">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ─── Live workshop status strip ─────────────────────────────────────── */}
    <section className="jac-section-band px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live Workshop Status — Musanze
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {statusReadouts.map(({ label, value, note }) => (
            <div key={label} className="bg-[#04110d]/95 px-5 py-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">{label}</p>
              <p className="mt-1.5 font-mono text-xl font-bold text-[#f0dc9c] md:text-2xl">{value}</p>
              <p className="mt-1 text-xs text-white/45">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── Core services grid ─────────────────────────────────────────────── */}
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div {...sectionReveal()} className="max-w-2xl">
          <p className="jac-eyebrow">What we work on</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Core services, engineered right</h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            Every job runs through the same structured process — diagnose, document, decide, repair —
            whether it's a warning light or a full rebuild.
          </p>
        </motion.div>

        <motion.div
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {coreServices.map(({ name, detail, Icon }) => (
            <motion.div key={name} variants={listItem} className="jac-surface p-6">
              <span className="jac-icon-tile h-12 w-12"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-bold text-white">{name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{detail}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="jac-btn jac-btn--ghost px-6 py-3 text-sm"
          >
            View all services
            <span className="ml-1" aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>

    {/* ─── Toyota partnership proof banner ────────────────────────────────── */}
    <section className="px-5 pb-16 md:px-8 md:pb-24">
      <motion.div
        {...sectionReveal()}
        className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#d4a93c]/25"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="group relative block h-64 w-full overflow-hidden md:h-auto"
          >
            <img
              src={featuredPartnershipPhoto.url}
              alt={featuredPartnershipPhoto.caption ?? 'Toyota Rwanda partnership'}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:bg-gradient-to-r" />
          </button>
          <div className="jac-surface flex flex-col justify-center rounded-none border-0 p-8 md:p-12">
            <span className="inline-flex w-fit items-center rounded-full border border-[#d4a93c]/40 bg-[#d4a93c]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#f0dc9c]">
              Toyota Rwanda Authorized Partner
            </span>
            <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">
              Now a Toyota-authorized service center in Musanze
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              {COMPANY_LEGAL} officially partnered with Toyota Rwanda in March 2026, bringing genuine
              parts, factory-grade tooling, and Toyota Global Standard procedures to Musanze drivers.
            </p>
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="jac-btn jac-btn--secondary mt-6 w-fit px-6 py-3 text-sm"
            >
              See the gallery
              <span className="ml-1" aria-hidden>→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>

    {/* ─── Why Junior Auto Clinique ───────────────────────────────────────── */}
    <section className="jac-section-band px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div {...sectionReveal()} className="max-w-2xl">
          <p className="jac-eyebrow">Why choose us</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">A workshop you can verify</h2>
        </motion.div>

        <motion.div
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {proofPoints.map(({ title, detail, Icon }) => (
            <motion.div key={title} variants={listItem} className="jac-surface p-7">
              <span className="jac-icon-tile h-12 w-12"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ─── Final CTA ───────────────────────────────────────────────────────── */}
    <section className="px-5 py-20 md:px-8 md:py-28">
      <motion.div
        {...sectionReveal()}
        className="jac-surface mx-auto flex max-w-4xl flex-col items-center gap-6 p-10 text-center md:p-14"
      >
        <span className="jac-icon-tile h-14 w-14"><IconUsers className="h-6 w-6" /></span>
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Your car's next service starts with one honest diagnosis.
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
          Bring it in, or book a slot — we'll tell you exactly what's going on before anything is touched.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="jac-btn jac-btn--primary px-8 py-3"
          >
            Book a service
          </button>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="jac-btn jac-btn--secondary px-8 py-3"
          >
            Explore services
          </button>
        </div>
      </motion.div>
    </section>
    </>
  )
}

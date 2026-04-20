import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COMPANY_LEGAL } from '../lib/constants'

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function HomePage() {
  const navigate = useNavigate()
  const loopSlides = [...SLIDES, ...SLIDES]

  return (
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
          className="mx-auto flex w-full max-w-[56rem] flex-1 flex-col justify-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={item}
            className="inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-full border border-white/15 bg-black/45 px-5 py-3 text-xs font-medium tracking-wide text-white/95 shadow-lg backdrop-blur-md sm:text-sm"
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
            variants={item}
            className="font-display-classic mt-10 max-w-5xl text-[2.35rem] leading-[1.14] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.1]"
          >
            <span className="block text-white">Automotive care built on</span>
            <span className="mt-2 block bg-gradient-to-r from-[#F4D03F] via-[#f0e6a8] to-[#c8e6d4] bg-clip-text text-transparent drop-shadow-none">
              clarity, skill &amp; trust
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-10 max-w-2xl text-base leading-relaxed text-white/92 sm:text-lg md:text-xl"
          >
            {COMPANY_LEGAL} welcomes you to a full-service garage where modern diagnostics, careful
            mechanical work, and straight answers come standard — whether you need a warning light
            investigated, a long trip checked, or a fleet kept dependable.
          </motion.p>

          <motion.ul variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-3">
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

          <motion.div variants={item} className="mt-14 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
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

          <motion.p variants={item} className="mt-8 text-sm text-white/60">
            Also visit:{' '}
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="font-sans text-white/75 underline-offset-4 transition hover:text-white hover:underline"
            >
              Blog
            </button>
            {' · '}
            <button
              type="button"
              onClick={() => navigate('/careers')}
              className="font-sans text-white/75 underline-offset-4 transition hover:text-white hover:underline"
            >
              Careers
            </button>
            {' · '}
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="font-sans text-white/75 underline-offset-4 transition hover:text-white hover:underline"
            >
              About
            </button>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto mt-auto grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6"
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
  )
}

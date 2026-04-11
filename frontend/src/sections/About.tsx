import { motion } from 'framer-motion'
import { COMPANY_LEGAL } from '../lib/constants'
import { sectionReveal } from '../lib/motion'
import { SectionFrame } from '../components/SectionFrame'

const IMG_1 = '/stock/about-1.jpg'
const IMG_2 = '/stock/about-2.jpg'

const SECTION_BG = '/stock/section-about-bg.jpg'

export function About() {
  return (
    <SectionFrame id="about" bgUrl={SECTION_BG} maxWidth="6xl">
      <motion.div
        {...sectionReveal(0)}
        className="max-w-2xl rounded-3xl border border-emerald-500/25 bg-emerald-950/85 px-6 py-6 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-8 md:py-7"
      >
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-400">Who we are</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-fg drop-shadow-sm md:text-4xl">
          About us
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-brand-fg/95 md:text-xl">
          {COMPANY_LEGAL} — a large, modern garage built for precision work and clear communication.
        </p>
      </motion.div>

      <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
        <motion.div
          {...sectionReveal(0.06)}
          className="space-y-4 rounded-3xl border border-emerald-500/25 bg-emerald-950/85 px-6 py-6 leading-relaxed text-brand-fg/95 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-8 md:py-7"
        >
          <p>
            We combine up-to-date equipment with experienced technicians to keep your vehicle safe,
            efficient, and road-ready. From routine maintenance to complex engine work, we treat every
            car with the same professional standard.
          </p>
          <p>
            Our workshop is designed for throughput and quality: organized bays, transparent
            assessments, and service recommendations you can trust.
          </p>
        </motion.div>

        <motion.div {...sectionReveal(0.12)} className="grid grid-cols-2 gap-4">
          <motion.div
            className="overflow-hidden rounded-3xl ring-2 ring-emerald-500/35 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]"
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
          >
            <img
              src={IMG_1}
              alt="Modern auto garage with vehicles in the workshop"
              className="h-48 w-full object-cover md:h-56"
            />
          </motion.div>
          <motion.div
            className="overflow-hidden rounded-3xl ring-2 ring-emerald-500/35 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]"
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
          >
            <img
              src={IMG_2}
              alt="Technician and equipment in the service bay"
              className="h-48 w-full object-cover md:h-56"
            />
          </motion.div>
        </motion.div>
      </div>
    </SectionFrame>
  )
}

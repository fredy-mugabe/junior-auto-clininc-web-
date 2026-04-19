import { motion } from 'framer-motion'
import { IconAward, IconShield, IconUsers, IconWrench } from '../components/ClassicIcons'
import { COMPANY_LEGAL } from '../lib/constants'
import { GARAGE_IMAGES } from '../lib/garageImages'

const pillars = [
  { label: 'Safety culture', Icon: IconShield },
  { label: 'Skilled team', Icon: IconUsers },
  { label: 'Right-first repairs', Icon: IconWrench },
  { label: 'Recognized standards', Icon: IconAward },
] as const

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">About us</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
            {COMPANY_LEGAL} is a large, modern garage built for precision work, transparent communication,
            and repeat trust — not one-off transactions. We designed our operation around what drivers and
            fleet managers actually need: fast triage when something is wrong, careful workmanship when it
            is time to repair, and honest guidance when a fix can wait.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
            Our culture emphasizes documentation, clean bays, and respect for your time. That means
            realistic appointment windows, updates if a job reveals additional work, and a handover where
            you understand what was done and what to watch for on the road ahead.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.04 }}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {pillars.map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-[#051616]/50 px-4 py-3 text-sm font-semibold text-white/90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F4D03F]/30 text-[#F4D03F]">
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </div>
          ))}
        </motion.div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-5 text-white/85"
          >
            <p className="leading-relaxed">
              We combine up-to-date equipment with experienced technicians to keep your vehicle safe,
              efficient, and road-ready. From routine maintenance to complex engine and electrical work, we
              apply the same professional standard: verify, repair, retest, and confirm results before we
              call the job complete.
            </p>
            <p className="leading-relaxed">
              Our workshop layout supports throughput without sacrificing quality — dedicated diagnostics
              space, organized tool and parts workflows, and service advisors who bridge the gap between
              technical detail and everyday language. The outcome is less confusion, fewer surprises on the
              invoice, and a relationship you can rely on for the life of your vehicle.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src={GARAGE_IMAGES.aboutGridMechanic}
              alt="Mechanic working on a vehicle"
              className="h-48 w-full rounded-2xl object-cover shadow-lg ring-1 ring-emerald-500/25 md:h-56"
              loading="lazy"
              decoding="async"
            />
            <img
              src={GARAGE_IMAGES.aboutGridTools}
              alt="Garage tools and workshop"
              className="h-48 w-full rounded-2xl object-cover shadow-lg ring-1 ring-emerald-500/25 md:h-56"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

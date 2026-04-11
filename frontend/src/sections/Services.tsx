import { motion } from 'framer-motion'
import {
  cardHover,
  listContainer,
  listItem,
  sectionHeaderContainer,
  sectionHeaderItem,
} from '../lib/motion'
import { SectionFrame } from '../components/SectionFrame'

const SECTION_BG = '/stock/section-services-bg.jpg'

const items = [
  {
    title: 'Car diagnostics',
    desc: 'Computer scans, electrical checks, and systematic troubleshooting to pinpoint issues fast.',
    icon: '🔧',
  },
  {
    title: 'Engine repair',
    desc: 'From timing and cooling systems to major rebuilds — precision work with quality parts.',
    icon: '⚙️',
  },
  {
    title: 'Maintenance',
    desc: 'Oil service, brakes, suspension, and scheduled care to extend vehicle life and reliability.',
    icon: '🛡️',
  },
] as const

export function Services() {
  return (
    <SectionFrame id="services" bgUrl={SECTION_BG} maxWidth="6xl">
      <motion.div
        className="max-w-2xl rounded-3xl border border-emerald-500/25 bg-emerald-950/85 px-6 py-6 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-8 md:py-7"
        variants={sectionHeaderContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px', amount: 0.35 }}
      >
        <motion.p
          variants={sectionHeaderItem}
          className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-400"
        >
          What we offer
        </motion.p>
        <motion.h2
          variants={sectionHeaderItem}
          className="mt-3 text-3xl font-extrabold tracking-tight text-brand-fg drop-shadow-sm md:text-4xl"
        >
          Services
        </motion.h2>
        <motion.p
          variants={sectionHeaderItem}
          className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-brand-fg/95 md:text-xl"
        >
          Core capabilities that keep drivers on the road with confidence.
        </motion.p>
      </motion.div>

      <motion.ul
        variants={listContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {items.map(({ title, desc, icon }) => (
          <motion.li
            key={title}
            variants={listItem}
            whileHover={cardHover}
            className="group rounded-3xl border border-emerald-500/25 bg-emerald-950/80 p-6 shadow-[0_14px_44px_-18px_rgba(0,0,0,0.4)] backdrop-blur-sm transition hover:border-emerald-400/35 hover:bg-emerald-900/75 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)]"
          >
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow/35 text-2xl shadow-inner ring-1 ring-brand-yellow/25"
              aria-hidden
            >
              {icon}
            </span>
            <h3 className="mt-5 text-xl font-bold text-brand-fg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-fg-muted">{desc}</p>
          </motion.li>
        ))}
      </motion.ul>
    </SectionFrame>
  )
}

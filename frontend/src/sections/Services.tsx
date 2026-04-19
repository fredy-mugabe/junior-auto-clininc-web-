import { motion } from 'framer-motion'
import { IconEngine, IconGauge, IconSearch } from '../components/ClassicIcons'

const items = [
  {
    title: 'Car diagnostics',
    desc: 'We start with structured interviews about symptoms, then scan, measure, and test in a logical order — avoiding unnecessary parts swaps. You get a clear summary of codes, live data when relevant, and a recommended plan that separates safety-critical items from optional improvements.',
    Icon: IconSearch,
  },
  {
    title: 'Engine repair',
    desc: 'From timing and cooling systems to leaks, mounts, and major internal work, engine jobs are planned with correct specifications, quality gaskets and fasteners, and post-repair checks. We focus on durable repairs rather than quick patches that fail under heat and load.',
    Icon: IconEngine,
  },
  {
    title: 'Maintenance',
    desc: 'Oil and filters, brakes, suspension, steering, and scheduled services are tailored to how you drive and what the manufacturer recommends — adjusted for local conditions. Preventive maintenance is how we help you avoid breakdowns, higher fuel use, and premature component wear.',
    Icon: IconGauge,
  },
] as const

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemMotion = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white md:text-4xl"
        >
          Services
        </motion.h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
          Our core capabilities cover what most drivers need throughout a vehicle&apos;s life: finding
          problems accurately, fixing them with the right parts and methods, and keeping up with
          maintenance so small issues do not turn into expensive failures.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
          Every category below is supported by trained technicians, documented procedures, and quality
          checks before return. If you are unsure which service fits your situation, contact us — we will
          point you to the right starting point, whether that is a diagnostic session or a scheduled care
          package.
        </p>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {items.map(({ title, desc, Icon }) => (
            <motion.li
              key={title}
              variants={itemMotion}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="jac-card p-6 transition hover:ring-emerald-400/35"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F4D03F]/35 text-[#F4D03F]"
                aria-hidden
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/78 md:text-[0.9375rem]">{desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'

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
    <section id="services" className="scroll-mt-24 bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-brand-green md:text-4xl"
        >
          Services
        </motion.h2>
        <p className="mt-2 max-w-2xl text-lg text-brand-green-mid/90">
          Core capabilities that keep drivers on the road with confidence.
        </p>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {items.map(({ title, desc, icon }) => (
            <motion.li
              key={title}
              variants={itemMotion}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-brand-green/10 bg-white p-6 shadow-lg shadow-brand-green/5 transition hover:shadow-xl"
            >
              <span className="text-3xl" aria-hidden>
                {icon}
              </span>
              <h3 className="mt-4 text-xl font-bold text-brand-green">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-green/85">{desc}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

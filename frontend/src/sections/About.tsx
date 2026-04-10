import { motion } from 'framer-motion'
import { COMPANY_LEGAL } from '../lib/constants'

const IMG_1 = '/stock/about-1.jpg'
const IMG_2 = '/stock/about-2.jpg'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold tracking-tight text-brand-green md:text-4xl">About us</h2>
          <p className="mt-2 max-w-2xl text-lg text-brand-green-mid/90">
            {COMPANY_LEGAL} — a large, modern garage built for precision work and clear communication.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-4 text-brand-green/95"
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

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src={IMG_1}
              alt="Mechanic working on a vehicle"
              className="h-48 w-full rounded-2xl object-cover shadow-lg md:h-56"
            />
            <img
              src={IMG_2}
              alt="Garage tools and workshop"
              className="h-48 w-full rounded-2xl object-cover shadow-lg md:h-56"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { scrollToSection } from '../lib/scroll'

const HERO_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80'

const container = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.12 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92svh] items-center justify-center overflow-hidden pt-20"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-green/80 via-brand-green-mid/65 to-brand-yellow/35" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 text-left md:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-white shadow-sm backdrop-blur-sm"
          >
            <img
              src="/branding/logo-mark.png"
              alt=""
              className="h-9 w-9 rounded-full border border-white/40 bg-white/10 object-contain"
            />
            <span className="text-sm font-semibold tracking-wide">Junior Auto Clinic</span>
          </motion.div>

          <motion.img
            src="/branding/logo-wordmark.png"
            alt="J.A.C Junior Auto Clinic"
            className="h-auto max-h-24 w-auto max-w-[min(90vw,480px)] object-contain drop-shadow-lg md:max-h-28"
            variants={item}
          />
          <motion.h1
            variants={item}
            className="text-balance text-4xl font-extrabold tracking-tight text-white drop-shadow md:text-6xl"
          >
            Welcome to Junior Auto Clinic
          </motion.h1>
          <motion.p
            variants={item}
            className="max-w-3xl text-pretty text-base font-medium text-white/95 drop-shadow md:text-lg"
          >
            Your trusted garage for diagnostics, repairs, and maintenance — done professionally, on time,
            and with clear communication.
          </motion.p>
          <motion.p
            variants={item}
            className="max-w-2xl text-lg font-medium text-white drop-shadow md:text-xl"
          >
            Modern diagnostics, expert repairs, and dependable maintenance — your vehicle deserves
            professional care at Junior Auto Clinique ltd.
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap items-center justify-start gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('apply')}
              className="rounded-2xl bg-brand-yellow px-8 py-3.5 text-base font-bold text-brand-green shadow-lg transition hover:bg-brand-yellow-deep"
            >
              Apply for a role
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => scrollToSection('services')}
              className="rounded-2xl border-2 border-white bg-white/15 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              Our services
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

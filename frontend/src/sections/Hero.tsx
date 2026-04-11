import { motion } from 'framer-motion'
import {
  easeOutExpo,
  heroContainer,
  heroHeadline,
  heroItem,
  heroSubline,
  hoverLift,
  tapSquish,
} from '../lib/motion'
import { scrollToSection } from '../lib/scroll'

const HERO_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[92svh] scroll-mt-28 items-center justify-center overflow-hidden px-3 pt-24 md:px-5"
    >
      <motion.div
        className="absolute inset-3 rounded-[2rem] bg-cover bg-center md:inset-5 md:rounded-[2.5rem]"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.35, ease: easeOutExpo }}
      />
      <div className="absolute inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-950/65 via-emerald-900/45 to-emerald-950/40 md:inset-5 md:rounded-[2.5rem]" />
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] ring-1 ring-emerald-400/25 md:inset-5 md:rounded-[2.5rem]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-14 text-left md:px-6 md:py-20">
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6 md:gap-7"
        >
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-4 rounded-full border border-emerald-400/35 bg-black/40 px-5 py-3 text-brand-fg shadow-lg backdrop-blur-md md:gap-5 md:px-6 md:py-3.5"
          >
            <img
              src="/branding/logo-mark.png"
              alt="J.A.C Junior Auto Clinic"
              className="h-14 w-14 rounded-full border-2 border-emerald-400/40 bg-emerald-950/50 object-contain md:h-16 md:w-16"
            />
            <span className="text-base font-semibold tracking-wide md:text-lg">Junior Auto Clinic</span>
          </motion.div>

          <motion.h1
            variants={heroHeadline}
            className="text-balance text-4xl font-extrabold tracking-tight text-brand-fg drop-shadow-md md:text-6xl"
          >
            Welcome to Junior Auto Clinic
          </motion.h1>
          <motion.p
            variants={heroSubline}
            className="max-w-3xl text-pretty text-base font-medium leading-relaxed text-brand-fg/95 drop-shadow md:text-lg"
          >
            Your trusted garage for diagnostics, repairs, and maintenance — done professionally, on time,
            and with clear communication.
          </motion.p>
          <motion.div variants={heroItem} className="flex flex-wrap items-center justify-start gap-3 pt-1 md:gap-4">
            <motion.button
              type="button"
              whileHover={hoverLift}
              whileTap={tapSquish}
              onClick={() => scrollToSection('apply')}
              className="rounded-full bg-gradient-to-r from-brand-yellow to-brand-yellow-deep px-8 py-3.5 text-base font-bold text-brand-green shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] transition hover:brightness-105"
            >
              Apply for a role
            </motion.button>
            <motion.button
              type="button"
              whileHover={hoverLift}
              whileTap={tapSquish}
              onClick={() => scrollToSection('services')}
              className="rounded-full border-2 border-emerald-400/45 bg-emerald-950/55 px-8 py-3.5 text-base font-bold text-brand-fg shadow-lg backdrop-blur-md transition hover:bg-emerald-900/70"
            >
              Our services
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

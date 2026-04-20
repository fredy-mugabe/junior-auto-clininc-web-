import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { GARAGE_IMAGES } from '../lib/garageImages'

export function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[min(82svh,900px)] overflow-hidden rounded-none">
      <img
        src={GARAGE_IMAGES.heroHome}
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full object-cover object-top"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
      />
      {/* Global gradient + vignette for strong top-to-bottom readability */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-br from-[#051616]/58 via-[#051616]/44 to-[#0a2824]/58"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[#041312]/93 via-[#051616]/28 to-black/18"
        aria-hidden
      />
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_220px_rgba(0,0,0,0.4)]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[min(82svh,900px)] max-w-7xl flex-col justify-center px-6 py-20 md:px-12 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-emerald-500/35 bg-black/40 px-5 py-3 pr-6 backdrop-blur-sm"
        >
          <img
            src="/branding/logo-mark.png"
            alt=""
            className="h-9 w-9 rounded-full border-2 border-emerald-400/45 object-cover"
          />
          <span className="text-sm font-bold tracking-wide text-white">JUNIOR AUTO CLINIQUE ltd</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl"
        >
          Welcome to JUNIOR AUTO CLINIQUE ltd
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 max-w-3xl text-lg leading-relaxed text-white drop-shadow md:text-xl"
        >
          Your trusted garage for diagnostics, repairs, and maintenance — done professionally, on time,
          and with clear communication. We invest in modern scan tools, organized service bays, and a team
          that explains what your vehicle needs before any work is approved, so you always know what you
          are paying for and why it matters for safety and longevity.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-6 max-w-3xl text-base leading-relaxed text-white/95 drop-shadow-sm md:text-lg"
        >
          Whether you rely on your car for daily commuting, family travel, or business deliveries, we
          treat every booking with the same discipline: thorough inspection, honest recommendations, and
          workmanship you can depend on when you leave the workshop.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-12 flex flex-wrap gap-5"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/careers')}
            className="jac-btn jac-btn--primary !rounded-2xl px-9 py-4 text-base"
          >
            Apply for a role
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/services')}
            className="jac-btn jac-btn--secondary !rounded-2xl px-9 py-4 text-base"
          >
            Our services
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

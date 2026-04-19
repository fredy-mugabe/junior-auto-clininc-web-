import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { COMPANY_LEGAL } from '../lib/constants'

const SLIDES = ['/site/home-slide-1.png', '/site/home-slide-2.png', '/site/home-slide-3.png'] as const

export function HomePage() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[min(82svh,900px)] overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.25rem] md:rounded-b-[2.75rem] lg:rounded-b-[3.25rem]">
      <div className="home-slider-track pointer-events-none absolute inset-0 z-0">
        {[...SLIDES, ...SLIDES].map((src, idx) => (
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
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/72 via-[#051616]/52 to-black/72" aria-hidden />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#041312]/90 via-[#051616]/28 to-black/20" aria-hidden />
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_220px_rgba(0,0,0,0.42)]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[min(82svh,900px)] max-w-7xl flex-col justify-center px-5 py-14 md:px-12 md:py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]"
        >
          Welcome
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-3 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl"
        >
          {COMPANY_LEGAL}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 max-w-3xl text-lg leading-relaxed text-white/95 drop-shadow md:text-xl"
        >
          Your trusted destination for diagnostics, repairs, internship development, and professional
          vehicle care. We combine disciplined workshop standards with transparent communication so every
          customer understands what is happening on their vehicle.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 drop-shadow-sm md:text-lg"
        >
          Explore our services, read workshop updates on the blog, apply for opportunities, or contact our
          team directly. Everything you need starts here on one welcoming page.
        </motion.p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="rounded-2xl bg-[#F4D03F] px-7 py-3 font-bold text-black transition hover:brightness-105"
          >
            Our services
          </button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="rounded-2xl border-2 border-[#F4D03F]/60 bg-black/30 px-7 py-3 font-bold text-white backdrop-blur-sm transition hover:border-[#F4D03F] hover:bg-white/10"
          >
            Read blog
          </button>
          <button
            type="button"
            onClick={() => navigate('/careers')}
            className="rounded-2xl border-2 border-emerald-400/65 bg-[#051616]/55 px-7 py-3 font-bold text-white backdrop-blur-sm transition hover:border-emerald-300 hover:bg-[#0a2824]/90"
          >
            Apply now
          </button>
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="rounded-2xl border-2 border-white/40 bg-black/30 px-7 py-3 font-bold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/10"
          >
            Contact us
          </button>
        </div>
      </div>
    </section>
  )
}

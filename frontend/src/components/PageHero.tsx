import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Props = {
  bgUrl: string
  eyebrow?: string
  title: string
  /** Primary intro line under the title */
  subtitle: string
  /** Second paragraph — keeps hero copy substantial for visitors */
  subtitleSecondary?: string
  children?: ReactNode
}

export function PageHero({
  bgUrl,
  eyebrow,
  title,
  subtitle,
  subtitleSecondary,
  children,
}: Props) {
  return (
    <section className="relative min-h-[88dvh] overflow-hidden rounded-none">
      <img
        src={bgUrl}
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full object-cover object-top"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-br from-[#051616]/58 via-[#051616]/44 to-[#0a2824]/58"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[#041312]/93 via-[#051616]/28 to-black/18"
        aria-hidden
      />
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_220px_rgba(0,0,0,0.4)]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[88dvh] max-w-7xl flex-col justify-center px-5 py-16 md:px-12 md:py-24">
        {eyebrow ? (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/35 bg-black/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]"
          >
            {eyebrow}
          </motion.span>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-3xl text-lg leading-relaxed text-white drop-shadow md:text-xl"
        >
          {subtitle}
        </motion.p>
        {subtitleSecondary ? (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-4 max-w-3xl text-base leading-relaxed text-white/95 drop-shadow-sm md:text-lg"
          >
            {subtitleSecondary}
          </motion.p>
        ) : null}
        {children ? <div className="mt-8 flex flex-wrap gap-4">{children}</div> : null}
      </div>
    </section>
  )
}

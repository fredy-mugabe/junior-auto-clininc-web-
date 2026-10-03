import { motion } from 'framer-motion'
import { sectionReveal } from '../lib/motion'

interface FeaturedBannerProps {
  imageUrl: string
  imageAlt: string
  badge: string
  title: string
  detail: string
  ctaLabel: string
  onCtaClick: () => void
  className?: string
}

export function FeaturedBanner({
  imageUrl,
  imageAlt,
  badge,
  title,
  detail,
  ctaLabel,
  onCtaClick,
  className = '',
}: FeaturedBannerProps) {
  return (
    <section className={`px-5 py-16 md:px-8 md:py-24 ${className}`}>
      <motion.div
        {...sectionReveal()}
        className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#d4a93c]/25"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="group relative block h-64 w-full overflow-hidden md:h-auto"
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:bg-gradient-to-r" />
          </button>
          <div className="jac-surface flex flex-col justify-center rounded-none border-0 p-8 md:p-12">
            <span className="inline-flex w-fit items-center rounded-full border border-[#d4a93c]/40 bg-[#d4a93c]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#f0dc9c]">
              {badge}
            </span>
            <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{detail}</p>
            <button
              type="button"
              onClick={onCtaClick}
              className="jac-btn jac-btn--secondary mt-6 w-fit px-6 py-3 text-sm"
            >
              {ctaLabel}
              <span className="ml-1" aria-hidden>→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

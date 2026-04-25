import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { easeOutExpo } from '../lib/motion'

type Props = {
  eyebrow: string
  title: string
  /** Optional row above eyebrow (badges, icon strip, etc.) */
  lead?: ReactNode
  children?: ReactNode
}

/**
 * Premium marketing header used on inner pages (blog, contact, careers…).
 * Keeps layout, motion, and atmosphere consistent site-wide.
 */
export function MarketingHero({ eyebrow, title, lead, children }: Props) {
  return (
    <motion.section
      className="jac-marketing-hero relative overflow-hidden rounded-none"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.48, ease: easeOutExpo }}
    >
      <div className="jac-marketing-hero__bg" aria-hidden />
      <div className="jac-marketing-hero__shine" aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        {lead ? <div className="mb-6">{lead}</div> : null}
        <p className="jac-eyebrow">{eyebrow}</p>
        <h1 className="font-display-classic mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
          {title}
        </h1>
        {children}
      </div>
    </motion.section>
  )
}

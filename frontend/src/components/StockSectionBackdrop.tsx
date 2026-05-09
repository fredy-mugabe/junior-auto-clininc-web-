import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOutExpo } from '../lib/motion'

type Props = {
  bgUrl: string
  children: ReactNode
  className?: string
  overlayClassName?: string
  /** Use eager on first screen sections so the photo always requests immediately */
  imageLoading?: 'eager' | 'lazy'
}

/**
 * Full-width section with a stock photo and dark green wash so copy stays readable.
 */
export function StockSectionBackdrop({
  bgUrl,
  children,
  className = '',
  overlayClassName = 'bg-gradient-to-b from-[#051616]/66 via-[#051616]/58 to-[#041312]/82',
  imageLoading = 'lazy',
}: Props) {
  return (
    <section className={`relative min-h-[12rem] overflow-hidden ${className}`}>
      <img
        src={bgUrl}
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full object-cover object-top"
        width={2400}
        height={1350}
        loading={imageLoading}
        decoding="async"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} aria-hidden />
      <div className="absolute inset-0 z-[1] shadow-[inset_0_0_200px_rgba(0,0,0,0.36)]" aria-hidden />
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.48, ease: easeOutExpo }}
      >
        {children}
      </motion.div>
    </section>
  )
}

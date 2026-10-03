import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { sectionReveal } from '../lib/motion'

interface CtaBandProps {
  Icon: ComponentType<{ className?: string }>
  heading: string
  detail: string
  primaryLabel: string
  onPrimaryClick: () => void
  secondaryLabel?: string
  onSecondaryClick?: () => void
  className?: string
}

export function CtaBand({
  Icon,
  heading,
  detail,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
  className = '',
}: CtaBandProps) {
  return (
    <section className={`px-5 py-20 md:px-8 md:py-28 ${className}`}>
      <motion.div
        {...sectionReveal()}
        className="jac-surface mx-auto flex max-w-4xl flex-col items-center gap-6 p-10 text-center md:p-14"
      >
        <span className="jac-icon-tile h-14 w-14"><Icon className="h-6 w-6" /></span>
        <h2 className="text-2xl font-bold text-white md:text-3xl">{heading}</h2>
        <p className="max-w-xl text-sm leading-relaxed text-white/65 md:text-base">{detail}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button type="button" onClick={onPrimaryClick} className="jac-btn jac-btn--primary px-8 py-3">
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondaryClick && (
            <button type="button" onClick={onSecondaryClick} className="jac-btn jac-btn--secondary px-8 py-3">
              {secondaryLabel}
            </button>
          )}
        </div>
      </motion.div>
    </section>
  )
}

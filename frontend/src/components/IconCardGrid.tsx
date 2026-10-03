import { motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { listContainer, listItem, sectionReveal } from '../lib/motion'

export interface IconCardItem {
  title: string
  detail: string
  Icon: ComponentType<{ className?: string }>
}

interface IconCardGridProps {
  eyebrow?: string
  heading?: string
  intro?: string
  items: readonly IconCardItem[]
  columns?: 2 | 3 | 4
  /** Alternate background band, used to break up sections visually. */
  band?: boolean
  className?: string
}

const colClass: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'lg:grid-cols-4 sm:grid-cols-2',
}

export function IconCardGrid({
  eyebrow,
  heading,
  intro,
  items,
  columns = 3,
  band = false,
  className = '',
}: IconCardGridProps) {
  return (
    <section className={`${band ? 'jac-section-band' : ''} px-5 py-16 md:px-8 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || heading || intro) && (
          <motion.div {...sectionReveal()} className="max-w-2xl">
            {eyebrow && <p className="jac-eyebrow">{eyebrow}</p>}
            {heading && <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">{heading}</h2>}
            {intro && <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">{intro}</p>}
          </motion.div>
        )}

        <motion.div
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className={`grid grid-cols-1 gap-5 ${colClass[columns]} ${(eyebrow || heading || intro) ? 'mt-10' : ''}`}
        >
          {items.map(({ title, detail, Icon }) => (
            <motion.div key={title} variants={listItem} className="jac-surface p-6">
              <span className="jac-icon-tile h-12 w-12"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

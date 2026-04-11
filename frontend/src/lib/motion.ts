/**
 * Shared Framer Motion presets — spring-based entrances, staggers, and hovers
 * for a cohesive, polished feel across the site.
 */

export const spring = {
  soft: { type: 'spring' as const, stiffness: 380, damping: 34, mass: 0.88 },
  snappy: { type: 'spring' as const, stiffness: 520, damping: 38 },
  gentle: { type: 'spring' as const, stiffness: 260, damping: 30 },
} as const

/** Smooth cubic-bezier for rare tween-only cases */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const

export const viewportSection = { once: true, margin: '-60px' as const, amount: 0.22 }

/** Hero: orchestrated stagger on first paint */
export const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.14 },
  },
}

export const heroItem = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.soft,
  },
}

/** Hero headline: soft blur lift (single element — keeps cost low) */
export const heroHeadline = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ...spring.soft, delay: 0.02 },
  },
}

export const heroSubline = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: spring.soft,
  },
}

/** Section cards / copy blocks (scroll into view) */
export function sectionReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 32, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: viewportSection,
    transition: { ...spring.soft, delay },
  } as const
}

/** Blog / Services style header block — stagger eyebrow → title → lead */
export const sectionHeaderContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
}

export const sectionHeaderItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: spring.soft,
  },
}

/** Grid lists (blog cards, service cards) */
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.13, delayChildren: 0.06 },
  },
}

export const listItem = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.soft,
  },
}

/** Mobile nav link stagger */
export const menuContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.03 },
  },
}

export const menuItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: spring.soft },
}

/** Auth / account page shell */
export function pageEnter(delay = 0) {
  return {
    initial: { opacity: 0, y: 22, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { ...spring.soft, delay },
  } as const
}

/** Card hover — lift + slight scale */
export const cardHover = { y: -8, scale: 1.015, transition: spring.snappy }
export const cardHoverLight = { y: -5, transition: spring.snappy }

/** Primary CTA press */
export const tapSquish = { scale: 0.97, transition: spring.snappy }
export const hoverLift = { scale: 1.04, y: -2, transition: spring.snappy }

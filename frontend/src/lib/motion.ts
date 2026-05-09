/**
 * Shared Framer Motion presets tuned for professional, understated motion:
 * subtle distance, smoother easing, and restrained timing.
 */

export const spring = {
  soft: { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.95 },
  snappy: { type: 'spring' as const, stiffness: 360, damping: 32 },
  gentle: { type: 'spring' as const, stiffness: 200, damping: 28 },
} as const

/** Smooth cubic-bezier for rare tween-only cases */
export const easeOutExpo = [0.22, 1, 0.36, 1] as const

export const viewportSection = { once: true, margin: '-60px' as const, amount: 0.22 }

/** Hero: orchestrated stagger on first paint */
export const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: easeOutExpo },
  },
}

/** Hero headline: restrained reveal for premium feel */
export const heroHeadline = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.56, ease: easeOutExpo, delay: 0.02 },
  },
}

export const heroSubline = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: easeOutExpo },
  },
}

/** Section cards / copy blocks (scroll into view) */
export function sectionReveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: viewportSection,
    transition: { duration: 0.46, ease: easeOutExpo, delay },
  } as const
}

/** Softer vertical nudge for dense copy blocks */
export function fadeUpSoft(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' as const },
    transition: { duration: 0.44, ease: easeOutExpo, delay },
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
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.44, ease: easeOutExpo },
  },
}

/** Grid lists (blog cards, service cards) */
export const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

export const listItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: easeOutExpo },
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
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.34, ease: easeOutExpo } },
}

/** Auth / account page shell */
export function pageEnter(delay = 0) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: easeOutExpo, delay },
  } as const
}

/** Card hover — lift + slight scale */
export const cardHover = { y: -4, scale: 1.008, transition: spring.snappy }
export const cardHoverLight = { y: -3, transition: spring.snappy }

/** Primary CTA press */
export const tapSquish = { scale: 0.985, transition: spring.snappy }
export const hoverLift = { scale: 1.015, y: -1, transition: spring.snappy }

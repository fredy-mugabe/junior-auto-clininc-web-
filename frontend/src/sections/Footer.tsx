import { motion } from 'framer-motion'
import { spring } from '../lib/motion'
import { COMPANY_LEGAL, EMAIL, PHONES, TIN } from '../lib/constants'

const footerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const footerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: spring.soft },
}

const linkClass =
  'rounded-lg font-medium text-brand-fg underline decoration-emerald-500/50 underline-offset-[5px] transition hover:text-brand-yellow hover:decoration-brand-yellow/80'

export function Footer() {
  return (
    <footer className="mt-2 border-t border-emerald-500/30 bg-gradient-to-b from-emerald-950 via-emerald-900/90 to-emerald-950 py-8 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.08)] md:rounded-t-xl md:py-10">
      <motion.div
        variants={footerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px', amount: 0.2 }}
        className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-4 md:grid-cols-2 md:gap-8 md:px-6"
      >
        <motion.div variants={footerItem} className="max-w-sm md:justify-self-start">
          <div className="rounded-xl bg-emerald-950/80 p-2.5 ring-1 ring-emerald-400/25 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.35)]">
            <img
              src="/branding/logo-contact-strip.png"
              alt={`${COMPANY_LEGAL} contact information`}
              className="h-auto w-full max-w-sm object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          </div>
        </motion.div>
        <motion.div
          variants={footerItem}
          className="w-full space-y-3 text-left text-xs leading-snug md:justify-self-end md:text-right md:text-sm"
        >
          <p className="text-base font-bold tracking-tight text-brand-fg md:text-lg">{COMPANY_LEGAL}</p>
          <p className="text-brand-fg/95">
            <span className="font-semibold text-emerald-400">TIN:</span>{' '}
            <span className="text-brand-fg">{TIN}</span>
          </p>
          <div>
            <p className="font-semibold text-emerald-400">Phone</p>
            <ul className="mt-1 flex flex-col gap-1 md:items-end">
              {PHONES.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, '')}`} className={`${linkClass} inline-block`}>
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="break-words">
            <span className="font-semibold text-emerald-400">Email:</span>{' '}
            <a href={`mailto:${EMAIL}`} className={`${linkClass} inline-block break-all`}>
              {EMAIL}
            </a>
          </p>
        </motion.div>
        <motion.p
          variants={footerItem}
          className="col-span-full border-t border-emerald-500/20 pt-4 text-center text-[11px] text-brand-fg-muted md:pt-5 md:text-xs"
        >
          © {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.
        </motion.p>
      </motion.div>
    </footer>
  )
}

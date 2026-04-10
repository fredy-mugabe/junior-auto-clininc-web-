import { motion } from 'framer-motion'
import { COMPANY_LEGAL, EMAIL, PHONES, TIN } from '../lib/constants'

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-brand-green/10 bg-brand-green py-14 text-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-xl">
          <img
            src="/branding/logo-contact-strip.png"
            alt={`${COMPANY_LEGAL} contact information`}
            className="h-auto w-full max-w-md object-contain object-left"
          />
        </div>
        <div className="space-y-3 text-sm leading-relaxed">
          <p className="text-base font-bold text-brand-yellow">{COMPANY_LEGAL}</p>
          <p>
            <span className="font-semibold text-brand-yellow/90">TIN:</span> {TIN}
          </p>
          <div>
            <p className="font-semibold text-brand-yellow/90">Phone</p>
            <ul className="mt-1 space-y-1">
              {PHONES.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="underline-offset-2 hover:underline">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-semibold text-brand-yellow/90">Email:</span>{' '}
            <a href={`mailto:${EMAIL}`} className="underline-offset-2 hover:underline">
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
      <p className="mt-12 text-center text-xs text-white/70">
        © {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.
      </p>
    </motion.footer>
  )
}

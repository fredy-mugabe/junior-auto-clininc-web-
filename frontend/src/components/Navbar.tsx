import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { menuContainer, menuItem, spring } from '../lib/motion'
import { scrollToSection } from '../lib/scroll'

const links = [
  { kind: 'section', id: 'home', label: 'Home' },
  { kind: 'section', id: 'about', label: 'About' },
  { kind: 'section', id: 'services', label: 'Services' },
  { kind: 'section', id: 'blog', label: 'Blog' },
  { kind: 'section', id: 'apply', label: 'Apply' },
  { kind: 'route', to: '/account', label: 'Account' },
] as const

export function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function go(link: (typeof links)[number]) {
    if (link.kind === 'route') {
      navigate(link.to)
      setOpen(false)
      return
    }

    const id = link.id
    if (location.pathname !== '/') {
      navigate(`/#${id}`)
      setOpen(false)
      return
    }
    scrollToSection(id)
    setOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-950/25 px-3 py-2.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-5 md:py-3">
        <button
          type="button"
          onClick={() => go(links[0])}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-black/15 px-2 py-1.5 outline-none ring-emerald-400/25 focus-visible:ring-2"
          aria-label="J.A.C Home"
        >
          <img
            src="/branding/logo-wordmark.png"
            alt="J.A.C Junior Auto Clinic"
            className="h-9 w-auto max-w-[min(100vw-8rem,220px)] object-contain object-left drop-shadow-sm md:h-11"
          />
        </button>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
          {links.map((link) => (
            <motion.button
              key={link.kind === 'route' ? link.to : link.id}
              type="button"
              onClick={() => go(link)}
              whileHover={{ y: -2, transition: spring.snappy }}
              whileTap={{ scale: 0.97, transition: spring.snappy }}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-brand-fg/95 drop-shadow-sm transition hover:bg-emerald-950/45 hover:text-brand-fg"
            >
              {link.label}
            </motion.button>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/25 bg-black/20 text-brand-fg backdrop-blur-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring.soft}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-950/55 shadow-lg backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            <motion.div
              variants={menuContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col px-3 py-3"
            >
              {links.map((link) => (
                <motion.button
                  key={link.kind === 'route' ? link.to : link.id}
                  type="button"
                  variants={menuItem}
                  onClick={() => go(link)}
                  className="rounded-xl px-3 py-3 text-left text-base font-medium text-brand-fg/95 transition hover:bg-emerald-950/40"
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

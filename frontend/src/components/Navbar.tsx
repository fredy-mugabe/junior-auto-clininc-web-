import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-green/10 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={() => go(links[0])}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-white/80 px-2 py-1 outline-none ring-brand-green/40 shadow-sm shadow-brand-green/10 focus-visible:ring-2"
          aria-label="J.A.C Home"
        >
          <img
            src="/branding/logo-wordmark.png"
            alt="J.A.C Junior Auto Clinic"
            className="h-10 w-auto max-w-[min(100vw-8rem,240px)] object-contain object-left drop-shadow-sm md:h-12 md:drop-shadow"
          />
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => (
            <button
              key={link.kind === 'route' ? link.to : link.id}
              type="button"
              onClick={() => go(link)}
              className="rounded-md px-3 py-2 text-sm font-semibold text-brand-green/90 transition hover:text-brand-green hover:underline hover:decoration-brand-yellow hover:decoration-2 hover:underline-offset-8"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-green/20 bg-white/80 text-brand-green md:hidden"
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
            className="overflow-hidden border-t border-white/30 bg-white/95 backdrop-blur-md md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-4 py-3">
              {links.map((link) => (
                <button
                  key={link.kind === 'route' ? link.to : link.id}
                  type="button"
                  onClick={() => go(link)}
                  className="rounded-md px-3 py-3 text-left text-base font-semibold text-brand-green/90 transition hover:bg-brand-cream hover:text-brand-green"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

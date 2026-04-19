import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/careers', label: 'Apply' },
  { to: '/contact', label: 'Contact' },
] as const

type NavbarProps = {
  /** When true, bar floats over full-bleed hero (landing) so the hero can fill 100dvh. */
  overHero?: boolean
}

export function Navbar({ overHero = false }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className={[
        'z-50 px-4 pt-2 pb-2 md:px-8 md:pt-3 md:pb-3',
        overHero ? 'pointer-events-none absolute inset-x-0 top-0' : 'relative',
      ].join(' ')}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-[min(100%,1830px)] items-center justify-between gap-3 rounded-2xl border border-[#F4D03F]/35 bg-gradient-to-r from-black/25 via-[#0b1d18]/20 to-black/25 px-4 py-3 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:px-6">
        <NavLink
          to="/"
          className="flex min-w-0 shrink items-center gap-2 rounded-lg outline-none ring-[#F4D03F]/40 focus-visible:ring-2 sm:gap-3"
          aria-label="JUNIOR AUTO CLINIQUE ltd Home"
          onClick={() => setOpen(false)}
        >
          <img
            src="/branding/logo-mark.png"
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border-2 border-[#F4D03F]/80 object-cover md:h-11 md:w-11"
          />
          <span className="brand-script min-w-0 truncate text-sm font-bold tracking-wide text-white drop-shadow-md sm:text-base md:text-lg">
            JUNIOR AUTO CLINIQUE ltd
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-[#F4D03F] text-black shadow-[0_8px_24px_-8px_rgba(244,208,63,0.9)]'
                    : 'text-white drop-shadow-sm hover:bg-[#F4D03F]/20 hover:text-[#F4D03F]',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/careers"
          className="hidden rounded-xl bg-[#F4D03F] px-4 py-2 text-sm font-extrabold text-black shadow-[0_10px_30px_-12px_rgba(244,208,63,1)] transition hover:brightness-105 lg:inline-flex"
        >
          Apply now
        </NavLink>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F4D03F]/35 bg-black/20 text-[#F4D03F] backdrop-blur-sm lg:hidden"
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
            className="pointer-events-auto mx-4 mt-2 overflow-hidden rounded-2xl border border-[#F4D03F]/25 bg-black/20 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col px-3 py-3">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'rounded-xl px-3 py-3 text-left text-base font-semibold transition',
                      isActive
                        ? 'bg-[#F4D03F] text-black'
                        : 'text-white drop-shadow-sm hover:bg-[#F4D03F]/20 hover:text-[#F4D03F]',
                    ].join(' ')
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconPhone } from './ClassicIcons'
import { PHONES } from '../lib/constants'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
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
        'z-50 px-4 pt-3 pb-2 md:px-8 md:pt-4 md:pb-3',
        overHero ? 'pointer-events-none absolute inset-x-0 top-0' : 'relative',
      ].join(' ')}
    >
      {/* Status micro-bar */}
      <div className="pointer-events-none mx-auto mb-1.5 hidden w-full max-w-[min(100%,1830px)] items-center justify-between px-2 lg:flex">
        <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/50">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono">Musanze Workshop · Open</span>
        </div>
        <div className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#f0dc9c]/80">
          Toyota Rwanda Authorized Partner
        </div>
      </div>

      <div className="pointer-events-auto mx-auto flex w-full max-w-[min(100%,1830px)] items-center justify-between gap-3 rounded-2xl border border-white/12 bg-gradient-to-r from-black/35 via-[#0b1d18]/30 to-black/35 px-4 py-3.5 shadow-[0_14px_42px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl md:px-6">
        <NavLink
          to="/"
          className="flex min-w-0 shrink items-center gap-2 rounded-lg outline-none ring-emerald-400/35 focus-visible:ring-2 sm:gap-3"
          aria-label="JUNIOR AUTO CLINIQUE ltd Home"
          onClick={() => setOpen(false)}
        >
          <img
            src="/branding/logo-mark.png"
            alt=""
            className="h-9 w-9 shrink-0 rounded-full border-2 border-emerald-400/45 object-cover md:h-11 md:w-11"
          />
          <span className="brand-script min-w-0 truncate text-sm font-semibold tracking-[0.015em] text-white/95 drop-shadow-md sm:text-base md:text-[1.02rem]">
            JUNIOR AUTO CLINIQUE ltd
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'jac-btn jac-btn--nav relative px-3 py-2 transition',
                  isActive ? 'jac-btn--nav-active' : 'jac-btn--nav-idle',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <span className="inline-flex items-center gap-1.5">
                  {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f0dc9c]" aria-hidden />}
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${PHONES[0]}`}
            aria-label={`Call ${PHONES[0]}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 transition hover:border-[#d4a93c]/40 hover:bg-[#d4a93c]/10 hover:text-[#f0dc9c]"
          >
            <IconPhone className="h-4 w-4" />
          </a>
          <NavLink to="/careers" className="jac-btn jac-btn--primary px-4 py-2 text-sm">
            Apply now
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-black/20 text-white/80 backdrop-blur-sm transition hover:border-white/30 hover:text-white lg:hidden"
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
            className="pointer-events-auto mx-4 mt-2 overflow-hidden rounded-2xl border border-white/12 bg-black/20 backdrop-blur-xl lg:hidden"
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
                      'jac-btn jac-btn--nav w-full justify-start px-3 py-3 text-left text-base transition',
                      isActive ? 'jac-btn--nav-active' : 'jac-btn--nav-idle',
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

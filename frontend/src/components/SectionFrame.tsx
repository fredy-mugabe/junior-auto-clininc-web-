import type { ReactNode } from 'react'

/** Same visual shell as Hero: inset rounded image, dark emerald tint + veil, ring. */
type Props = {
  id?: string
  bgUrl: string
  /** Hero content uses max-w-5xl; wider grids (e.g. blog) use 6xl */
  maxWidth?: '5xl' | '6xl'
  className?: string
  children: ReactNode
}

export function SectionFrame({ id, bgUrl, maxWidth = '5xl', className = '', children }: Props) {
  const max = maxWidth === '6xl' ? 'max-w-6xl' : 'max-w-5xl'
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 overflow-hidden px-3 py-16 md:px-5 md:py-24 ${className}`}
    >
      <div
        className="absolute inset-3 rounded-[2rem] bg-cover bg-center md:inset-5 md:rounded-[2.5rem]"
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden
      />
      <div
        className="absolute inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-950/70 via-emerald-900/45 to-emerald-950/55 md:inset-5 md:rounded-[2.5rem]"
        aria-hidden
      />
      <div
        className="absolute inset-3 rounded-[2rem] bg-gradient-to-b from-emerald-950/80 via-emerald-950/55 to-brand-cream/92 md:inset-5 md:rounded-[2.5rem]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-3 rounded-[2rem] ring-1 ring-emerald-400/20 md:inset-5 md:rounded-[2.5rem]" />

      <div className={`relative z-10 mx-auto w-full ${max} px-4 py-6 md:px-6 md:py-10`}>{children}</div>
    </section>
  )
}

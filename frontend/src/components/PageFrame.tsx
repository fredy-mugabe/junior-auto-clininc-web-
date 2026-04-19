import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Home: flush to viewport — no curved outer frame or side gutters. */
  variant?: 'default' | 'fullBleed'
}

/**
 * Large rounded “framed” shell — deep green panel on black canvas (wide layout).
 * Use `fullBleed` on the landing route for a true edge-to-edge screen fill.
 */
export function PageFrame({ children, variant = 'default' }: Props) {
  const fullBleed = variant === 'fullBleed'

  return (
    <div
      className={
        fullBleed
          ? 'mx-auto w-full max-w-none px-0 pb-0'
          : 'mx-auto w-full max-w-[min(100%,1980px)] px-1 pt-0 pb-5 sm:px-2 md:px-4 md:pb-8 lg:px-6 lg:pb-10'
      }
    >
      <div
        className={
          fullBleed
            ? 'jac-frame overflow-hidden rounded-none shadow-none ring-0'
            : 'jac-frame overflow-hidden rounded-[2.25rem] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.75)] ring-1 ring-emerald-500/25 sm:rounded-[2.75rem] md:rounded-[3.25rem] lg:rounded-[4rem]'
        }
      >
        {children}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

/**
 * Edge-to-edge shell — full width, square corners (same treatment as the landing page site-wide).
 */
export function PageFrame({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-none px-0 pb-0">
      <div className="jac-frame overflow-hidden rounded-none shadow-none ring-0">{children}</div>
    </div>
  )
}

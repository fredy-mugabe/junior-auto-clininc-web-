/**
 * Live-status HUD strip — monospace readouts with a pulsing indicator dot.
 * Used under page heroes to show a handful of credible, at-a-glance facts.
 */
export interface StatusReadout {
  label: string
  value: string
  note?: string
}

interface StatusStripProps {
  title?: string
  readouts: readonly StatusReadout[]
  className?: string
}

export function StatusStrip({ title = 'Live Workshop Status — Musanze', readouts, className = '' }: StatusStripProps) {
  return (
    <section className={`jac-section-band px-5 py-8 md:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/40">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {title}
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {readouts.map(({ label, value, note }) => (
            <div key={label} className="bg-[#04110d]/95 px-5 py-5">
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">{label}</p>
              <p className="mt-1.5 font-mono text-xl font-bold text-[#f0dc9c] md:text-2xl">{value}</p>
              {note && <p className="mt-1 text-xs text-white/45">{note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

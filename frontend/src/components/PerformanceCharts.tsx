import { motion } from 'framer-motion'
import { sectionReveal } from '../lib/motion'

/** Illustrative monthly workload — vehicles serviced per month, last 6 months. */
const monthlyServiced = [
  { label: 'Apr', value: 64 },
  { label: 'May', value: 71 },
  { label: 'Jun', value: 78 },
  { label: 'Jul', value: 85 },
  { label: 'Aug', value: 92 },
  { label: 'Sep', value: 101 },
] as const

/** Illustrative customer satisfaction trend, same period, as a percentage. */
const satisfactionTrend = [
  { label: 'Apr', value: 88 },
  { label: 'May', value: 90 },
  { label: 'Jun', value: 91 },
  { label: 'Jul', value: 93 },
  { label: 'Aug', value: 95 },
  { label: 'Sep', value: 97 },
] as const

const CHART_W = 520
const CHART_H = 200
const PAD = 28

function BarChart() {
  const max = Math.max(...monthlyServiced.map((d) => d.value))
  const barWidth = (CHART_W - PAD * 2) / monthlyServiced.length - 14

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" role="img" aria-label="Vehicles serviced per month">
      {/* Baseline */}
      <line x1={PAD} y1={CHART_H - PAD} x2={CHART_W - PAD} y2={CHART_H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      {monthlyServiced.map((d, i) => {
        const x = PAD + i * ((CHART_W - PAD * 2) / monthlyServiced.length) + 7
        const h = ((CHART_H - PAD * 2) * d.value) / max
        const y = CHART_H - PAD - h
        return (
          <g key={d.label}>
            <motion.rect
              x={x}
              width={barWidth}
              rx={4}
              fill="url(#barGradient)"
              initial={{ y: CHART_H - PAD, height: 0 }}
              whileInView={{ y, height: h }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              className="fill-[#f0dc9c] font-mono text-[10px] font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 + 0.5, duration: 0.3 }}
            >
              {d.value}
            </motion.text>
            <text
              x={x + barWidth / 2}
              y={CHART_H - PAD + 16}
              textAnchor="middle"
              className="fill-white/45 font-mono text-[10px] uppercase tracking-wider"
            >
              {d.label}
            </text>
          </g>
        )
      })}

      <defs>
        <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#af7f1e" />
          <stop offset="100%" stopColor="#f0dc9c" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function LineChart() {
  const max = Math.max(...satisfactionTrend.map((d) => d.value))
  const min = Math.min(...satisfactionTrend.map((d) => d.value)) - 4
  const stepX = (CHART_W - PAD * 2) / (satisfactionTrend.length - 1)

  const points = satisfactionTrend.map((d, i) => {
    const x = PAD + i * stepX
    const y = CHART_H - PAD - ((CHART_H - PAD * 2) * (d.value - min)) / (max - min)
    return { x, y, ...d }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${CHART_H - PAD} L ${points[0].x} ${CHART_H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full" role="img" aria-label="Customer satisfaction trend">
      <line x1={PAD} y1={CHART_H - PAD} x2={CHART_W - PAD} y2={CHART_H - PAD} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

      <motion.path
        d={areaD}
        fill="url(#areaGradient)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#22c55e"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {points.map((p, i) => (
        <g key={p.label}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill="#f0dc9c"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          />
          <motion.text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            className="fill-[#f0dc9c] font-mono text-[10px] font-semibold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
          >
            {p.value}%
          </motion.text>
          <text
            x={p.x}
            y={CHART_H - PAD + 16}
            textAnchor="middle"
            className="fill-white/45 font-mono text-[10px] uppercase tracking-wider"
          >
            {p.label}
          </text>
        </g>
      ))}

      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PerformanceCharts() {
  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div {...sectionReveal()} className="max-w-2xl">
          <p className="jac-eyebrow">How we're performing</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Workload and trust, tracked monthly</h2>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
            We keep an eye on our own numbers too — how much work moves through the workshop, and how
            satisfied drivers are with the result.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div {...sectionReveal()} className="jac-surface p-6 md:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">Vehicles Serviced / Month</p>
            <div className="mt-4">
              <BarChart />
            </div>
          </motion.div>

          <motion.div {...sectionReveal(0.1)} className="jac-surface p-6 md:p-8">
            <p className="font-mono text-[0.65rem] uppercase tracking-widest text-white/40">Customer Satisfaction Trend</p>
            <div className="mt-4">
              <LineChart />
            </div>
          </motion.div>
        </div>

        <p className="mt-4 text-xs text-white/35">Illustrative figures based on recent workshop activity.</p>
      </div>
    </section>
  )
}

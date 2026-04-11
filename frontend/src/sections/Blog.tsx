import { motion } from 'framer-motion'
import {
  cardHoverLight,
  listContainer,
  listItem,
  sectionHeaderContainer,
  sectionHeaderItem,
} from '../lib/motion'
import { SectionFrame } from '../components/SectionFrame'

const BLOG_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80'

const posts = [
  {
    title: '5 signs your car needs diagnostics',
    date: '2026-04-08',
    tag: 'Maintenance',
    excerpt:
      'From warning lights to rough idling — here are the most common symptoms that mean it’s time for a quick scan and inspection.',
  },
  {
    title: 'Brake noises: what they mean',
    date: '2026-04-08',
    tag: 'Safety',
    excerpt:
      'Squealing, grinding, or clicking can point to very different issues. Learn what to listen for and when to stop driving.',
  },
  {
    title: 'How often should you change oil?',
    date: '2026-04-08',
    tag: 'Maintenance',
    excerpt:
      'Intervals depend on your engine, oil type, and driving conditions. Here’s a simple guide to avoid premature wear.',
  },
] as const

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function Blog() {
  return (
    <SectionFrame id="blog" bgUrl={BLOG_BG} maxWidth="6xl">
      <motion.div
        className="max-w-2xl rounded-3xl border border-emerald-500/25 bg-emerald-950/85 px-6 py-6 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md md:px-8 md:py-7"
        variants={sectionHeaderContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px', amount: 0.35 }}
      >
        <motion.p
          variants={sectionHeaderItem}
          className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-400"
        >
          From the workshop
        </motion.p>
        <motion.h2
          variants={sectionHeaderItem}
          className="mt-3 text-3xl font-extrabold tracking-tight text-brand-fg drop-shadow-sm md:text-5xl"
        >
          Blog
        </motion.h2>
        <motion.p
          variants={sectionHeaderItem}
          className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-brand-fg/95 md:text-xl"
        >
          Tips, maintenance guides, and quick explanations — written for drivers.
        </motion.p>
      </motion.div>

      <motion.ul
        variants={listContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="mt-12 grid gap-6 md:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.li
            key={post.title}
            variants={listItem}
            whileHover={cardHoverLight}
            className="rounded-3xl border border-emerald-500/25 bg-emerald-950/80 p-6 shadow-[0_16px_48px_-20px_rgba(0,0,0,0.4)] backdrop-blur-md transition hover:border-emerald-400/30 hover:shadow-[0_22px_56px_-24px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-800/90 px-3 py-1 text-xs font-semibold text-emerald-100">
                {post.tag}
              </span>
              <time className="text-xs font-medium text-brand-fg-muted" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </div>
            <h3 className="mt-4 text-xl font-bold text-brand-fg">{post.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-fg-muted">{post.excerpt}</p>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/30 transition hover:bg-brand-green-mid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow/60"
            >
              Read more
              <span aria-hidden>→</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
    </SectionFrame>
  )
}

import { motion } from 'framer-motion'

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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function Blog() {
  return (
    <section
      id="blog"
      className="relative scroll-mt-24 py-20 md:py-28"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2400&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-white/15 to-white/55 backdrop-blur-[0.5px]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-brand-green md:text-4xl"
        >
          Blog
        </motion.h2>
        <p className="mt-2 max-w-2xl text-lg text-brand-green-mid/90">
          Tips, maintenance guides, and quick explanations — written for drivers.
        </p>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.li
              key={post.title}
              variants={card}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-brand-green/10 bg-brand-cream p-6 shadow-lg shadow-brand-green/5 transition hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-green">
                  {post.tag}
                </span>
                <time className="text-xs font-medium text-brand-green/70" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <h3 className="mt-4 text-xl font-bold text-brand-green">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-green/85">{post.excerpt}</p>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-green/20 transition hover:bg-brand-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
              >
                Read more
                <span aria-hidden>→</span>
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}


import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconNotebook, IconShield, IconSparkle, IconWrench } from '../components/ClassicIcons'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { BLOG_POSTS } from '../content/blogPosts'
import { GARAGE_IMAGES } from '../lib/garageImages'

function TagIcon({ tag }: { tag: string }) {
  if (tag === 'Safety') {
    return <IconShield className="h-5 w-5" />
  }
  return <IconWrench className="h-5 w-5" />
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function BlogPage() {
  return (
    <>
      <motion.section
        className="relative overflow-hidden rounded-none px-4 py-16 md:px-8 md:py-24"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#051616] via-[#08221e] to-[#051616]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-[#F4D03F]">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F4D03F]/35 bg-black/30">
              <IconNotebook className="h-6 w-6" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em]">Blog</p>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            From the workshop
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/92 md:text-xl">
            Practical articles for drivers who want to understand their vehicles — not memorize jargon.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
            Each guide is written from real cases we see in the bays: the sounds customers describe, the
            warning patterns that show up after dusty roads, and the maintenance shortcuts that cost more
            later. Save the posts you care about and bring questions on your next visit.
          </p>
        </div>
      </motion.section>

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentBlog} className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            New guides are added as common questions come up in the workshop. We focus on patterns we see
            across many vehicles — the issues that waste money when ignored and the maintenance habits
            that pay off over years of ownership.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            Share posts with family members who manage their own cars, or forward them to fleet colleagues
            who coordinate maintenance budgets. If you would like a topic covered, mention it on your next
            visit or via email.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-500/25 bg-black/25 px-4 py-4 text-sm text-white/85 backdrop-blur-sm md:px-6">
            <span className="flex items-center gap-2 font-semibold text-[#F4D03F]">
              <IconSparkle className="h-4 w-4" />
              Reader tips
            </span>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
            <span>
              Bookmark articles on your phone before long trips — cellular signal can be patchy in the
              hills, and written guidance beats memory when a warning light appears at night.
            </span>
          </div>

          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {BLOG_POSTS.map((post, i) => (
              <motion.li
                key={post.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                className="flex flex-col rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-6 shadow-xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-semibold text-emerald-100">
                    <TagIcon tag={post.tag} />
                    {post.tag}
                  </span>
                  <time className="text-xs font-medium text-white/55" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{post.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/80 md:text-[0.9375rem]">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#F4D03F] px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-105"
                >
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </StockSectionBackdrop>
    </>
  )
}

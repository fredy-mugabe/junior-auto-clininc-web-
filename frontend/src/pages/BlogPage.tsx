import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconNotebook, IconShield, IconSparkle, IconWrench } from '../components/ClassicIcons'
import { MarketingHero } from '../components/MarketingHero'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { BLOG_POSTS } from '../content/blogPosts'
import { GARAGE_IMAGES } from '../lib/garageImages'
import { cardHoverLight, listContainer, listItem } from '../lib/motion'

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
      <MarketingHero
        eyebrow="Blog"
        title="From the workshop"
        lead={
          <span className="jac-icon-tile h-12 w-12 rounded-xl">
            <IconNotebook className="h-6 w-6" />
          </span>
        }
      >
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
          Practical articles for drivers who want to understand their vehicles — not memorize jargon.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:text-lg">
          Each guide is written from real cases we see in the bays: the sounds customers describe, the
          warning patterns that show up after dusty roads, and the maintenance shortcuts that cost more
          later. Save the posts you care about and bring questions on your next visit.
        </p>
      </MarketingHero>

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentBlog} className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            New guides are added as common questions come up in the workshop. We focus on patterns we see
            across many vehicles — the issues that waste money when ignored and the maintenance habits that
            pay off over years of ownership.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            Share posts with family members who manage their own cars, or forward them to fleet colleagues who
            coordinate maintenance budgets. If you would like a topic covered, mention it on your next visit
            or via email.
          </p>
          <div className="jac-surface mt-8 flex flex-wrap items-center gap-4 px-4 py-4 text-sm text-white/85 md:px-6">
            <span className="flex items-center gap-2 font-semibold text-[#F4D03F]">
              <IconSparkle className="h-4 w-4" />
              Reader tips
            </span>
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
            <span>
              Bookmark articles on your phone before long trips — cellular signal can be patchy in the hills,
              and written guidance beats memory when a warning light appears at night.
            </span>
          </div>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {BLOG_POSTS.map((post) => (
              <motion.li
                key={post.slug}
                variants={listItem}
                whileHover={cardHoverLight}
                className="jac-surface flex flex-col p-6"
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
                  className="jac-btn jac-btn--primary mt-5 min-h-12 w-fit gap-2 px-6 text-base"
                >
                  Read more
                  <span aria-hidden>→</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </StockSectionBackdrop>
    </>
  )
}

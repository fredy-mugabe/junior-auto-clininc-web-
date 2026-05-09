import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconBookmark, IconNotebook, IconSparkle } from '../components/ClassicIcons'
import { type BlogPost, fetchBlogPostBySlug, toParagraphs } from '../lib/blogApi'
import { pageEnter } from '../lib/motion'

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) {
      setPost(null)
      return
    }
    let active = true
    fetchBlogPostBySlug(slug)
      .then((data) => {
        if (active) setPost(data)
      })
      .catch(() => {
        if (active) setPost(null)
      })
    return () => {
      active = false
    }
  }, [slug])

  if (post === null) {
    return <Navigate to="/blog" replace />
  }
  if (post === undefined) return null

  return (
    <article className="px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl">
        <motion.div {...pageEnter()}>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F4D03F] underline-offset-2 hover:underline"
          >
            <IconNotebook className="h-4 w-4" />
            ← Back to blog
          </Link>
          <div className="jac-surface mt-6 flex items-center gap-3 border-[#F4D03F]/30 px-4 py-3 text-[#F4D03F]">
            <IconBookmark className="h-5 w-5 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">Workshop article</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-semibold text-emerald-100">
              {post.tag}
            </span>
            <time className="text-sm text-white/55" dateTime={post.published_at}>
              {formatDate(post.published_at)}
            </time>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-white/85">{post.excerpt}</p>
        </motion.div>

        <motion.div className="jac-surface mt-10 space-y-5 p-6 md:p-8" {...pageEnter(0.06)}>
          {toParagraphs(post.content).map((p, i) => (
            <p key={i} className="leading-relaxed text-white/88">
              {p}
            </p>
          ))}
        </motion.div>

        <motion.aside className="jac-surface mt-10 flex gap-4 p-5" {...pageEnter(0.12)}>
          <span className="jac-icon-tile h-10 w-10 shrink-0 rounded-lg">
            <IconSparkle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Before you drive away</p>
            <p className="mt-2 text-sm leading-relaxed text-white/78">
              If anything in this article matches what you are experiencing, note the conditions (speed,
              temperature, uphill vs flat). Those details help us reproduce the fault faster and quote more
              accurately before we open panels or order parts.
            </p>
          </div>
        </motion.aside>

        <p className="mt-10 text-center text-sm text-white/65">
          For more stories and updates, visit{' '}
          <Link
            to="/blog"
            className="font-semibold text-[#F4D03F] underline-offset-2 hover:underline"
          >
            our official blog
          </Link>{' '}
          on this site.
        </p>
      </div>
    </article>
  )
}

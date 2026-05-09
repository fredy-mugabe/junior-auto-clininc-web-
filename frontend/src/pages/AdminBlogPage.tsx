import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { getApiUrl } from '../lib/constants'
import { supabase } from '../lib/supabaseClient'

function suggestedSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function AdminBlogPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [tag, setTag] = useState('General')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [publishing, setPublishing] = useState(false)

  const autoSlug = useMemo(() => suggestedSlug(title), [title])

  useEffect(() => {
    if (!slug.trim()) {
      setSlug(autoSlug)
    }
  }, [autoSlug, slug])

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoadingAuth(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error || !data.session?.access_token) {
        toast.error(error?.message || 'Login failed')
        return
      }
      setAccessToken(data.session.access_token)
      toast.success('Admin signed in')
    } catch {
      toast.error('Could not sign in')
    } finally {
      setLoadingAuth(false)
    }
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken) {
      toast.error('Please sign in first')
      return
    }
    setPublishing(true)
    try {
      const res = await fetch(`${getApiUrl()}/api/blog-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          tag: tag.trim() || 'General',
          excerpt: excerpt.trim(),
          content: content.trim(),
          published: true,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; slug?: string }
      if (!res.ok) {
        toast.error(data.error || 'Could not publish blog post')
        return
      }
      toast.success(`Published successfully (${data.slug ?? 'new post'})`)
      setTitle('')
      setSlug('')
      setTag('General')
      setExcerpt('')
      setContent('')
    } catch {
      toast.error('Network error while publishing')
    } finally {
      setPublishing(false)
    }
  }

  const inputClass =
    'mt-1 w-full rounded-xl border border-emerald-500/30 bg-black/35 px-4 py-3 text-white placeholder:text-white/40 outline-none ring-emerald-500/30 focus:ring-2'

  return (
    <section className="px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white md:text-4xl">Admin blog publisher</h1>
          <p className="mt-3 text-white/80">
            Sign in with an admin Supabase account, then publish a new blog article.
          </p>
        </header>

        {!accessToken && (
          <form onSubmit={signIn} className="jac-surface space-y-4 p-6">
            <h2 className="text-xl font-semibold text-white">Admin login</h2>
            <div>
              <label className="block text-sm font-semibold text-white/90">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button type="submit" disabled={loadingAuth} className="jac-btn jac-btn--primary px-6 py-3">
              {loadingAuth ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        {accessToken && (
          <form onSubmit={publish} className="jac-surface space-y-5 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white">Create blog post</h2>
            <div>
              <label className="block text-sm font-semibold text-white/90">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90">Tag</label>
              <input value={tag} onChange={(e) => setTag(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90">Excerpt</label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white/90">Content</label>
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full article content. Use blank lines to create paragraphs."
                className={inputClass}
                required
              />
            </div>
            <button
              type="submit"
              disabled={publishing}
              className="jac-btn jac-btn--primary w-full justify-center py-3"
            >
              {publishing ? 'Publishing...' : 'Publish blog post'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function escapeIlikeToken(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/,/g, ' ')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sb = getSupabase()

    if (req.method === 'GET') {
      const page = Math.max(1, Number(req.query.page) || 1)
      const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9))
      const from = (page - 1) * limit
      const to = from + limit - 1
      const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : ''
      const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''

      let query = sb
        .from('blog_posts')
        .select('slug,title,excerpt,tag,published_at', { count: 'exact' })
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .range(from, to)

      if (tag) {
        query = query.eq('tag', tag)
      }
      if (search) {
        const token = escapeIlikeToken(search)
        const pattern = `%${token}%`
        query = query.or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      }

      const { data, error, count } = await query

      if (error) {
        console.error(error)
        const hint =
          error.code === '42P01' || String(error.message || '').includes('does not exist')
            ? 'Create the blog_posts table in Supabase (run docs/supabase-blog-schema.sql).'
            : undefined
        return res.status(500).json({
          error: 'Failed to fetch blog posts',
          details: error.message,
          hint,
        })
      }
      return res.status(200).json({
        items: data ?? [],
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
      })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const auth = String(req.headers.authorization || '')
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing bearer token' })
    }
    const token = auth.slice(7)
    const {
      data: { user },
      error: userErr,
    } = await sb.auth.getUser(token)

    if (userErr || !user?.email) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }
    if (!getAdminEmails().includes(user.email.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const raw = req.body as
      | {
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          tag?: string
          published?: boolean
          published_at?: string
        }
      | undefined

    const title = String(raw?.title || '').trim()
    const excerpt = String(raw?.excerpt || '').trim()
    const content = String(raw?.content || '').trim()
    const tag = String(raw?.tag || 'General').trim()
    const slug = toSlug(String(raw?.slug || title))
    const published = raw?.published ?? true

    if (title.length < 3 || title.length > 200) {
      return res.status(400).json({ error: 'Title must be between 3 and 200 characters' })
    }
    if (excerpt.length < 10 || excerpt.length > 500) {
      return res.status(400).json({ error: 'Excerpt must be between 10 and 500 characters' })
    }
    if (content.length < 20 || content.length > 20000) {
      return res.status(400).json({ error: 'Content must be between 20 and 20000 characters' })
    }
    if (!slug) {
      return res.status(400).json({ error: 'Could not generate a valid slug' })
    }

    const { data, error } = await sb
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        tag: tag || 'General',
        is_published: published,
        published_at: published ? raw?.published_at || new Date().toISOString() : null,
        author_email: user.email.toLowerCase(),
      })
      .select('id,slug')
      .single()

    if (error) {
      console.error(error)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'A blog post with this slug already exists' })
      }
      return res.status(500).json({ error: 'Failed to create blog post' })
    }
    return res.status(201).json({ ok: true, id: data?.id, slug: data?.slug })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('Missing SUPABASE')) {
      return res.status(503).json({
        error:
          'Server missing Supabase configuration. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy.',
      })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}

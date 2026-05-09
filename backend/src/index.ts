import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express, { type Request, type Response } from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load environment variables.
// 1) Try default `.env` in current working directory (how most Node apps run).
// 2) Fallback to `backend/.env` when running from `backend/src`.
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[env] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Ensure backend/.env exists and restart the API.',
  )
}
import cors from 'cors'
import { body, validationResult } from 'express-validator'
import { getSupabaseAdmin } from './lib/supabaseAdmin.js'

const app = express()
const port = Number(process.env.PORT) || 4000
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Escape `%`, `_`, `\` for Postgres ILIKE inside PostgREST `.or()` filters. */
function escapeIlikeToken(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/,/g, ' ')
}

app.use(
  cors({
    origin:
      frontendOrigins.length <= 1
        ? frontendOrigins[0] ?? 'http://localhost:5173'
        : frontendOrigins,
    credentials: true,
  }),
)
app.use(express.json({ limit: '256kb' }))

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})

app.get('/api/blog-posts', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseAdmin()
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9))
    const from = (page - 1) * limit
    const to = from + limit - 1
    const tag = typeof req.query.tag === 'string' ? req.query.tag.trim() : ''
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''

    let query = supabase
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
    return res.json({
      items: data ?? [],
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : ''
    if (msg.includes('Missing SUPABASE')) {
      return res.status(503).json({
        error:
          'API missing Supabase keys. Create a file named .env inside the backend folder with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then restart the API.',
      })
    }
    return res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/blog-posts/:slug', async (req: Request, res: Response) => {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug,title,excerpt,content,tag,published_at')
      .eq('is_published', true)
      .eq('slug', req.params.slug)
      .maybeSingle()

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch blog post' })
    }
    if (!data) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    return res.json(data)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post(
  '/api/apply',
  [
    body('full_name').trim().isLength({ min: 2, max: 200 }),
    body('email').trim().isEmail(),
    body('phone').trim().isLength({ min: 6, max: 40 }),
    body('type').isIn(['job', 'internship']),
    body('message').optional({ values: 'falsy' }).isLength({ max: 5000 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const supabase = getSupabaseAdmin()
      const { full_name, email, phone, type, message } = req.body as {
        full_name: string
        email: string
        phone: string
        type: 'job' | 'internship'
        message?: string
      }
      const { data, error } = await supabase
        .from('applications')
        .insert({
          full_name,
          email,
          phone,
          type,
          message: message ?? null,
        })
        .select('id')
        .single()

      if (error) {
        console.error(error)
        return res.status(500).json({
          error:
            'Could not save to the database. Create the `applications` table in Supabase (see docs/supabase-schema.sql) and check the API logs.',
        })
      }
      return res.json({ ok: true, id: data?.id })
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('Missing SUPABASE')) {
        return res.status(503).json({
          error:
            'API missing Supabase keys. Create a file named .env inside the backend folder (not backend/backend) with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then restart the API.',
        })
      }
      return res.status(500).json({ error: 'Server error. Check API terminal logs.' })
    }
  },
)

app.get('/api/applications', async (req: Request, res: Response) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }
  const jwt = auth.slice(7)
  try {
    const supabase = getSupabaseAdmin()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt)
    if (error || !user?.email) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }
    if (!adminEmails.includes(user.email.toLowerCase())) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const { data, error: qErr } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (qErr) {
      console.error(qErr)
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }
    return res.json(data ?? [])
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.post(
  '/api/blog-posts',
  [
    body('title').trim().isLength({ min: 3, max: 200 }),
    body('slug').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 220 }),
    body('excerpt').trim().isLength({ min: 10, max: 500 }),
    body('content').trim().isLength({ min: 20, max: 20000 }),
    body('tag').optional({ values: 'falsy' }).trim().isLength({ max: 60 }),
    body('published').optional().isBoolean(),
    body('published_at').optional({ values: 'falsy' }).isISO8601(),
  ],
  async (req: Request, res: Response) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing bearer token' })
    }
    const jwt = auth.slice(7)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const supabase = getSupabaseAdmin()
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser(jwt)

      if (userErr || !user?.email) {
        return res.status(401).json({ error: 'Invalid or expired session' })
      }
      if (!adminEmails.includes(user.email.toLowerCase())) {
        return res.status(403).json({ error: 'Forbidden' })
      }

      const bodyData = req.body as {
        title: string
        slug?: string
        excerpt: string
        content: string
        tag?: string
        published?: boolean
        published_at?: string
      }
      const slug = toSlug(bodyData.slug?.trim() || bodyData.title)
      if (!slug) {
        return res.status(400).json({ error: 'Could not generate a valid slug' })
      }

      const shouldPublish = bodyData.published ?? true
      const publishedAt = shouldPublish ? bodyData.published_at || new Date().toISOString() : null

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: bodyData.title.trim(),
          slug,
          excerpt: bodyData.excerpt.trim(),
          content: bodyData.content.trim(),
          tag: bodyData.tag?.trim() || 'General',
          is_published: shouldPublish,
          published_at: publishedAt,
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
      return res.status(500).json({ error: 'Server error' })
    }
  },
)

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

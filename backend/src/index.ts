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

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

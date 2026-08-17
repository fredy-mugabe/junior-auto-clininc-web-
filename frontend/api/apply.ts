import type { VercelRequest, VercelResponse } from '@vercel/node'
import busboy from 'busboy'
import { createClient } from '@supabase/supabase-js'
import { randomBytes, randomUUID } from 'node:crypto'

export const config = {
  maxDuration: 60,
}

/** Self-contained for Vercel (avoids importing from backend/ — cleaner TS resolution). */
function insertFailureBody(err: { message: string; code?: string }) {
  const m = (err.message || '').toLowerCase()
  const rls =
    m.includes('row-level security') ||
    m.includes('violates row-level') ||
    m.includes('new row violates')
  const missing =
    m.includes('does not exist') ||
    err.code === '42P01' ||
    (m.includes('relation') && m.includes('does not exist'))
  const denied = m.includes('permission denied') || err.code === '42501'

  let hint: string
  if (rls) {
    hint =
      'Row Level Security blocked this insert. In Vercel → Environment Variables, set SUPABASE_SERVICE_ROLE_KEY to the service_role key from Supabase → Settings → API (not the anon / public key). Redeploy after saving.'
  } else if (missing) {
    hint =
      'Postgres could not use public.applications. In Supabase → SQL → New query, run docs/supabase-complete-setup.sql for the same project as SUPABASE_URL, then try again.'
  } else if (denied) {
    hint =
      'Permission denied. Confirm SUPABASE_SERVICE_ROLE_KEY is the service_role secret and that SUPABASE_URL is the matching Supabase project URL.'
  } else {
    hint = err.message
  }

  return {
    error: 'Could not save the application.',
    hint,
    code: err.code ?? null,
  }
}

const CV_BUCKET = process.env.CV_BUCKET || 'applications-cv'

const OK_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

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

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

type ValidBody = {
  full_name: string
  email: string
  phone: string
  type: 'job' | 'internship'
  message: string | null
}

function validate(fields: Record<string, string>): { ok: true; data: ValidBody } | { ok: false; errors: { msg: string }[] } {
  const full_name = (fields.full_name ?? '').trim()
  const email = (fields.email ?? '').trim()
  const phone = (fields.phone ?? '').trim()
  const type = (fields.type ?? '').trim()
  const messageRaw = fields.message
  const message =
    messageRaw !== undefined && messageRaw !== null && String(messageRaw).trim()
      ? String(messageRaw).trim()
      : ''

  const errors: { msg: string }[] = []
  if (full_name.length < 2 || full_name.length > 200) {
    errors.push({ msg: 'Full name must be between 2 and 200 characters.' })
  }
  if (!isEmail(email)) {
    errors.push({ msg: 'Invalid email.' })
  }
  if (phone.length < 6 || phone.length > 40) {
    errors.push({ msg: 'Phone must be between 6 and 40 characters.' })
  }
  if (type !== 'job' && type !== 'internship') {
    errors.push({ msg: 'Invalid application type.' })
  }
  if (message.length > 5000) {
    errors.push({ msg: 'Message is too long.' })
  }

  if (errors.length) return { ok: false as const, errors }

  return {
    ok: true as const,
    data: {
      full_name,
      email,
      phone,
      type: type as 'job' | 'internship',
      message: message || null,
    },
  }
}

/** Vercel often parses JSON into `req.body`; fallback for string / edge cases. */
function fieldsFromJsonBody(req: VercelRequest): Record<string, string> {
  const raw = req.body as unknown
  let o: Record<string, unknown>
  if (raw && typeof raw === 'object' && !Buffer.isBuffer(raw)) {
    o = raw as Record<string, unknown>
  } else if (typeof raw === 'string') {
    try {
      o = JSON.parse(raw) as Record<string, unknown>
    } catch {
      return {}
    }
  } else {
    return {}
  }
  return {
    full_name: String(o.full_name ?? ''),
    email: String(o.email ?? ''),
    phone: String(o.phone ?? ''),
    type: String(o.type ?? ''),
    message: o.message !== undefined && o.message !== null ? String(o.message) : '',
  }
}

function parseMultipart(req: VercelRequest): Promise<{
  fields: Record<string, string>
  file: { buffer: Buffer; mimeType: string } | null
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {}
    let fileData: { buffer: Buffer; mimeType: string } | null = null
    let limitHit = false

    const bb = busboy({
      headers: req.headers,
      limits: { fileSize: 8 * 1024 * 1024 },
    })

    bb.on('file', (fieldname, file, info) => {
      if (fieldname !== 'cv') {
        file.resume()
        return
      }
      const chunks: Buffer[] = []
      file.on('data', (c: Buffer) => chunks.push(c))
      file.on('limit', () => {
        limitHit = true
      })
      file.on('end', () => {
        if (!limitHit && chunks.length > 0) {
          fileData = {
            buffer: Buffer.concat(chunks),
            mimeType: info.mimeType || 'application/octet-stream',
          }
        }
      })
    })

    bb.on('field', (name, val) => {
      fields[name] = val
    })

    bb.on('finish', () => {
      if (limitHit) {
        reject(new Error('FILE_TOO_LARGE'))
        return
      }
      resolve({ fields, file: fileData })
    })

    bb.on('error', reject)
    req.pipe(bb)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const contentType = String(req.headers['content-type'] || '')

  let fields: Record<string, string>
  let file: { buffer: Buffer; mimeType: string } | null = null

  try {
    if (contentType.includes('application/json')) {
      fields = fieldsFromJsonBody(req)
    } else if (contentType.includes('multipart/form-data')) {
      const parsed = await parseMultipart(req)
      fields = parsed.fields
      file = parsed.file
    } else {
      return res.status(400).json({
        error:
          'Unsupported Content-Type. Send application/json (from the website form) or multipart/form-data (e.g. with an optional CV file).',
      })
    }

    const v = validate(fields)
    // Use `in` so TS 3.9 / Vercel build narrows the union (ok === false is not always enough).
    if ('errors' in v) {
      return res.status(400).json({ errors: v.errors })
    }
    const { full_name, email, phone, type, message } = v.data

    const sb = getSupabase()

    let cv_path: string | null = null
    if (file && file.buffer.length > 0) {
      if (!OK_TYPES.has(file.mimeType)) {
        return res.status(400).json({ error: 'CV must be a PDF or Word document.' })
      }

      await sb.storage.createBucket(CV_BUCKET, { public: false }).catch(() => undefined)

      const ext =
        file.mimeType === 'application/pdf'
          ? 'pdf'
          : file.mimeType === 'application/msword'
            ? 'doc'
            : 'docx'
      const rand = randomBytes(8).toString('hex')
      const uploadId = randomUUID()
      cv_path = `anon/${uploadId}/${Date.now()}-${rand}.${ext}`

      const { error: upErr } = await sb.storage.from(CV_BUCKET).upload(cv_path, file.buffer, {
        contentType: file.mimeType,
        upsert: false,
      })
      if (upErr) {
        console.error(upErr)
        return res.status(500).json({ error: 'Could not upload CV. Please try again.' })
      }
    }

    const { data, error } = await sb
      .from('applications')
      .insert({
        full_name,
        email,
        phone,
        type,
        message,
        cv_path,
      })
      .select('id')
      .single()

    if (error) {
      console.error(error)
      return res.status(500).json(insertFailureBody(error))
    }

    return res.status(200).json({ ok: true, id: data?.id })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'CV must be 8MB or smaller.' })
    }
    if (msg.includes('Missing SUPABASE')) {
      return res.status(503).json({
        error:
          'Server missing Supabase configuration. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables, then redeploy.',
      })
    }
    return res.status(500).json({ error: 'Server error.' })
  }
}

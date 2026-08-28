import type { VercelRequest, VercelResponse } from '@vercel/node'
import busboy from 'busboy'
import { createClient } from '@supabase/supabase-js'
import { randomBytes, randomUUID } from 'node:crypto'

export const config = {
  maxDuration: 60,
}

const GALLERY_BUCKET = 'gallery'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB

/* ─── Supabase (service role — bypasses RLS) ────────────────────────────── */
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

/* ─── Admin emails ──────────────────────────────────────────────────────── */
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/* ─── Validate Bearer JWT → return user email or error ─────────────────── */
async function resolveAdmin(
  req: VercelRequest,
  sb: ReturnType<typeof getSupabase>
): Promise<{ ok: true; email: string } | { ok: false; status: number; error: string }> {
  const auth = String(req.headers.authorization || '')
  if (!auth.startsWith('Bearer ')) {
    return { ok: false, status: 401, error: 'Missing bearer token.' }
  }
  const token = auth.slice(7)
  const {
    data: { user },
    error: userErr,
  } = await sb.auth.getUser(token)

  if (userErr || !user?.email) {
    return { ok: false, status: 401, error: 'Invalid or expired session.' }
  }
  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    return { ok: false, status: 403, error: 'Forbidden — not an admin account.' }
  }
  return { ok: true, email: user.email.toLowerCase() }
}

/* ─── Parse multipart/form-data ─────────────────────────────────────────── */
function parseMultipart(req: VercelRequest): Promise<{
  fields: Record<string, string>
  file: { buffer: Buffer; mimeType: string; filename: string } | null
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {}
    let fileData: { buffer: Buffer; mimeType: string; filename: string } | null = null
    let limitHit = false

    const bb = busboy({
      headers: req.headers,
      limits: { fileSize: MAX_FILE_BYTES },
    })

    bb.on('file', (fieldname, fileStream, info) => {
      if (fieldname !== 'image') {
        fileStream.resume()
        return
      }
      const chunks: Buffer[] = []
      fileStream.on('data', (c: Buffer) => chunks.push(c))
      fileStream.on('limit', () => {
        limitHit = true
      })
      fileStream.on('end', () => {
        if (!limitHit && chunks.length > 0) {
          fileData = {
            buffer: Buffer.concat(chunks),
            mimeType: info.mimeType || 'application/octet-stream',
            filename: info.filename || 'upload',
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

/* ─── Main route handler ─────────────────────────────────────────────────── */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()

  try {
    const sb = getSupabase()

    /* ── GET — public list of gallery images ─────────────────────────── */
    if (req.method === 'GET') {
      const page = Math.max(1, Number(req.query.page) || 1)
      const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50))
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await sb
        .from('gallery_images')
        .select('id,url,caption,created_at,storage_path', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('[gallery GET]', error)
        return res.status(500).json({
          error: 'Failed to fetch gallery images.',
          details: error.message,
          hint:
            error.code === '42P01'
              ? 'The gallery_images table does not exist. Run the setup SQL in your Supabase SQL Editor.'
              : undefined,
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

    /* ── POST — admin upload image ───────────────────────────────────── */
    if (req.method === 'POST') {
      const admin = await resolveAdmin(req, sb)
      if (!admin.ok) return res.status(admin.status).json({ error: admin.error })

      const contentType = String(req.headers['content-type'] || '')
      if (!contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Expected multipart/form-data.' })
      }

      const { fields, file } = await parseMultipart(req)
      const caption = (fields.caption ?? '').trim() || null

      if (!file || file.buffer.length === 0) {
        return res.status(400).json({ error: 'No image file received.' })
      }

      if (!ALLOWED_MIME_TYPES.has(file.mimeType)) {
        return res.status(400).json({
          error: `Unsupported file type "${file.mimeType}". Allowed: JPEG, PNG, WebP, GIF, AVIF.`,
        })
      }

      // Build a unique, collision-proof storage path
      const ext = MIME_TO_EXT[file.mimeType] ?? 'jpg'
      const rand = randomBytes(8).toString('hex')
      const uploadId = randomUUID()
      const storagePath = `uploads/${uploadId}/${Date.now()}-${rand}.${ext}`

      // Ensure bucket exists (idempotent — silently ignores "already exists")
      await sb.storage.createBucket(GALLERY_BUCKET, { public: true }).catch(() => undefined)

      // Upload to Supabase Storage using the service role key (bypasses all storage RLS)
      const { error: storageErr } = await sb.storage
        .from(GALLERY_BUCKET)
        .upload(storagePath, file.buffer, {
          contentType: file.mimeType,
          upsert: false,
        })

      if (storageErr) {
        console.error('[gallery POST] storage upload:', storageErr)
        return res.status(500).json({
          error: 'Failed to upload image to storage.',
          details: storageErr.message,
        })
      }

      // Build permanent public URL
      const { data: urlData } = sb.storage.from(GALLERY_BUCKET).getPublicUrl(storagePath)
      const publicUrl = urlData.publicUrl

      // Insert metadata row into gallery_images
      const { data: row, error: dbErr } = await sb
        .from('gallery_images')
        .insert({
          url: publicUrl,
          caption,
          storage_path: storagePath,
          uploaded_by: admin.email,
        })
        .select('id,url,caption,created_at,storage_path')
        .single()

      if (dbErr) {
        // Best-effort cleanup of the orphaned storage object
        await sb.storage.from(GALLERY_BUCKET).remove([storagePath]).catch(() => undefined)
        console.error('[gallery POST] db insert:', dbErr)

        const hint =
          dbErr.code === '42P01'
            ? 'The gallery_images table does not exist. Run the setup SQL in your Supabase SQL Editor.'
            : dbErr.message.toLowerCase().includes('storage_path') ||
              dbErr.message.toLowerCase().includes('uploaded_by')
            ? 'Add missing columns: ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS storage_path text; ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS uploaded_by text;'
            : undefined

        return res.status(500).json({
          error: 'Image uploaded but failed to save metadata to database.',
          details: dbErr.message,
          hint,
        })
      }

      return res.status(201).json({ ok: true, image: row })
    }

    /* ── DELETE — admin remove image ─────────────────────────────────── */
    if (req.method === 'DELETE') {
      const admin = await resolveAdmin(req, sb)
      if (!admin.ok) return res.status(admin.status).json({ error: admin.error })

      const body = req.body as { id?: string; storage_path?: string } | undefined
      const id = (body?.id ?? '').trim()
      const bodyPath = (body?.storage_path ?? '').trim()

      if (!id) {
        return res.status(400).json({ error: 'Missing required field: id' })
      }

      // Fetch the row to retrieve storage_path if not supplied by client
      let storagePath = bodyPath
      if (!storagePath) {
        const { data: existing } = await sb
          .from('gallery_images')
          .select('storage_path,url')
          .eq('id', id)
          .single()

        if (existing?.storage_path) {
          storagePath = existing.storage_path as string
        } else if (existing?.url) {
          // Fallback for legacy rows that stored the full URL
          const match = (existing.url as string).match(/\/object\/public\/gallery\/(.+)$/)
          if (match) storagePath = match[1]
        }
      }

      // Remove from storage (best-effort — don't fail if already gone)
      if (storagePath) {
        const { error: storageErr } = await sb.storage
          .from(GALLERY_BUCKET)
          .remove([storagePath])
        if (storageErr) {
          console.warn('[gallery DELETE] storage remove warning:', storageErr.message)
        }
      }

      // Delete the DB row
      const { error: dbErr } = await sb.from('gallery_images').delete().eq('id', id)
      if (dbErr) {
        console.error('[gallery DELETE] db delete:', dbErr)
        return res.status(500).json({
          error: 'Failed to delete image record.',
          details: dbErr.message,
        })
      }

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed.' })
  } catch (e) {
    console.error('[gallery] unexpected error:', e)
    const msg = e instanceof Error ? e.message : ''
    if (msg === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'Image must be 10 MB or smaller.' })
    }
    if (msg.includes('Missing SUPABASE')) {
      return res.status(503).json({
        error:
          'Server missing Supabase configuration. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables, then redeploy.',
      })
    }
    return res.status(500).json({ error: 'Unexpected server error.' })
  }
}

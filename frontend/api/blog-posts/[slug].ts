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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const slug = String(req.query.slug || '').trim()
    if (!slug) {
      return res.status(400).json({ error: 'Missing slug' })
    }

    const sb = getSupabase()
    const { data, error } = await sb
      .from('blog_posts')
      .select('slug,title,excerpt,content,tag,published_at')
      .eq('is_published', true)
      .eq('slug', slug)
      .maybeSingle()

    if (error) {
      console.error(error)
      return res.status(500).json({ error: 'Failed to fetch blog post' })
    }
    if (!data) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    return res.status(200).json(data)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Server error' })
  }
}

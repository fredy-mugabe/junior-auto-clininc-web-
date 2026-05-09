import { getApiUrl } from './constants'
import { supabase } from './supabaseClient'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  tag: string
  published_at: string
}

export type BlogListResponse = {
  items: BlogPost[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export function toParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
}

function supabaseBlogConfigured(): boolean {
  const url = String(import.meta.env.VITE_SUPABASE_URL || '').trim()
  const key = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
  return Boolean(url && key)
}

function escapeIlikeToken(raw: string): string {
  return raw.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/,/g, ' ')
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 400): Promise<T> {
  let last: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      last = e
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)))
      }
    }
  }
  throw last instanceof Error ? last : new Error(String(last))
}

/**
 * Read published posts directly from Supabase (anon + RLS).
 * Used when /api/blog-posts fails (e.g. Vercel function env or routing).
 */
async function fetchBlogPostsViaSupabase(params: {
  page?: number
  limit?: number
  search?: string
  tag?: string
}): Promise<BlogListResponse> {
  const page = Math.max(1, params.page ?? 1)
  const limit = Math.min(50, Math.max(1, params.limit ?? 9))
  const from = (page - 1) * limit
  const to = from + limit - 1
  const search = params.search?.trim() || ''
  const tag = params.tag?.trim() || ''

  let query = supabase
    .from('blog_posts')
    .select('slug,title,excerpt,content,tag,published_at', { count: 'exact' })
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
    throw new Error(
      `${error.message}. If the table is missing, run docs/supabase-blog-schema.sql and docs/supabase-blog-seed.sql in Supabase.`,
    )
  }

  const items = (data ?? []) as BlogPost[]
  const total = count ?? 0
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }
}

async function fetchBlogPostBySlugViaSupabase(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug,title,excerpt,content,tag,published_at')
    .eq('is_published', true)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }
  return data as BlogPost | null
}

async function fetchBlogPostsFromApi(params: {
  page?: number
  limit?: number
  search?: string
  tag?: string
}): Promise<BlogListResponse> {
  const query = new URLSearchParams()
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.search) query.set('search', params.search)
  if (params.tag) query.set('tag', params.tag)

  const suffix = query.toString() ? `?${query.toString()}` : ''
  const res = await fetch(`${getApiUrl()}/api/blog-posts${suffix}`)
  const text = await res.text()
  let payload: unknown
  try {
    payload = text ? JSON.parse(text) : null
  } catch {
    throw new Error(
      `Blog API returned non-JSON (${res.status}). Check that /api/blog-posts exists on this deployment.`,
    )
  }

  if (!res.ok) {
    const errObj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {}
    const detail =
      typeof errObj.error === 'string'
        ? errObj.error
        : typeof errObj.details === 'string'
          ? errObj.details
          : res.statusText
    const hint = typeof errObj.hint === 'string' ? ` ${errObj.hint}` : ''
    throw new Error(`${detail || 'Request failed'} (${res.status}).${hint}`)
  }

  if (Array.isArray(payload)) {
    const items = payload as BlogPost[]
    return {
      items,
      page: 1,
      limit: items.length,
      total: items.length,
      totalPages: 1,
    }
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as BlogListResponse).items)
  ) {
    return payload as BlogListResponse
  }

  throw new Error('Invalid blog response from server.')
}

export async function fetchBlogPosts(params: {
  page?: number
  limit?: number
  search?: string
  tag?: string
}): Promise<BlogListResponse> {
  try {
    return await withRetry(() => fetchBlogPostsFromApi(params))
  } catch (apiErr) {
    if (!supabaseBlogConfigured()) {
      throw apiErr instanceof Error ? apiErr : new Error(String(apiErr))
    }
    try {
      return await withRetry(() => fetchBlogPostsViaSupabase(params))
    } catch {
      const first = apiErr instanceof Error ? apiErr.message : String(apiErr)
      throw new Error(
        `API failed (${first}). Direct database read also failed — check VITE_SUPABASE_* and RLS on blog_posts.`,
      )
    }
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await withRetry(async () => {
      const r = await fetch(`${getApiUrl()}/api/blog-posts/${encodeURIComponent(slug)}`)
      if (!r.ok && r.status >= 500) throw new Error(`Server ${r.status}`)
      return r
    })
    const text = await res.text()
    if (res.status === 404) {
      return null
    }
    let payload: unknown
    try {
      payload = text ? JSON.parse(text) : null
    } catch {
      throw new Error(`Blog post API returned non-JSON (${res.status}).`)
    }
    if (!res.ok) {
      const errObj = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {}
      const detail = typeof errObj.error === 'string' ? errObj.error : res.statusText
      throw new Error(`${detail} (${res.status})`)
    }
    return payload as BlogPost
  } catch (apiErr) {
    if (!supabaseBlogConfigured()) {
      throw apiErr instanceof Error ? apiErr : new Error(String(apiErr))
    }
    try {
      return await fetchBlogPostBySlugViaSupabase(slug)
    } catch {
      const first = apiErr instanceof Error ? apiErr.message : String(apiErr)
      throw new Error(`API failed (${first}). Direct read failed — check Supabase config and blog_posts table.`)
    }
  }
}

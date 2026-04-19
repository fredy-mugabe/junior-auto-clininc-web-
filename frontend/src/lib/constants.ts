export const COMPANY_LEGAL = 'JUNIOR AUTO CLINIQUE ltd'
export const COMPANY_SHORT = 'J.A.C'
export const TIN = '10732005'
export const PHONES = ['0784481659'] as const
export const EMAIL = 'Juniorautoclinic@gmail.com'

/** Default Google Maps embed `src` if `VITE_GOOGLE_MAPS_EMBED_SRC` is unset (About page). */
const GOOGLE_MAPS_EMBED_DEFAULT =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4211.733615337331!2d29.63703007521667!3d-1.5150986359195138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc5b000822b393%3A0xf73d5e5f730954cb!2sjunior%20auto%20clinic!5e1!3m2!1sen!2srw!4v1776519584978!5m2!1sen!2srw'

/** Google Maps iframe `src` — override with `VITE_GOOGLE_MAPS_EMBED_SRC` in Vercel. */
export function getGoogleMapsEmbedSrc(): string {
  const raw = import.meta.env.VITE_GOOGLE_MAPS_EMBED_SRC
  if (raw !== undefined && String(raw).trim() !== '') {
    return String(raw).trim()
  }
  return GOOGLE_MAPS_EMBED_DEFAULT
}

/** Blog index on this SPA (same website). */
export const OFFICIAL_BLOG_PATH = '/blog' as const

/**
 * Full URL for the official blog.
 * - If `VITE_OFFICIAL_BLOG_URL` is set → use that (e.g. external WordPress).
 * - Else if `VITE_SITE_URL` is set → `${VITE_SITE_URL}/blog`.
 * - Else in the browser → `${window.location.origin}/blog` (works on Vercel preview/production).
 * - Else → `/blog` (relative; fine for same-tab links).
 */
export function getOfficialBlogUrl(): string {
  const raw = import.meta.env.VITE_OFFICIAL_BLOG_URL
  if (raw !== undefined && String(raw).trim() !== '') {
    return String(raw).trim().replace(/\/$/, '')
  }
  const site = import.meta.env.VITE_SITE_URL
  if (site !== undefined && String(site).trim() !== '') {
    return `${String(site).trim().replace(/\/$/, '')}${OFFICIAL_BLOG_PATH}`
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${OFFICIAL_BLOG_PATH}`
  }
  return OFFICIAL_BLOG_PATH
}

/**
 * Base URL for the Express API.
 * - Dev: leave `VITE_API_URL` empty so requests go to `/api/*` on the Vite dev server (see vite.config proxy → port 4000).
 * - Prod: set `VITE_API_URL` to your deployed API origin (no trailing slash).
 */
export function getApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (raw === undefined || raw === '') {
    return ''
  }
  return String(raw).replace(/\/$/, '')
}

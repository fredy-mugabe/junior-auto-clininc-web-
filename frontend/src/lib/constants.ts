export const COMPANY_LEGAL = 'Junior Auto Clinique ltd'
export const COMPANY_SHORT = 'J.A.C'
export const TIN = '10732005'
export const PHONES = ['078891761', '078803161', '0788917754'] as const
export const EMAIL = 'hakizap-2013@gmail.com'

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

import { useState } from 'react'
import { toast } from 'sonner'
import type { Session } from '@supabase/supabase-js'
import { getApiUrl } from '../lib/constants'

type Row = {
  id: string
  full_name: string
  email: string
  phone: string
  type: string
  message: string | null
  cv_path?: string | null
  created_at: string
}

export function AdminApplications({ session }: { session: Session | null }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function load() {
    if (!session?.access_token) {
      toast.error('No session.')
      return
    }
    setLoading(true)
    setRows(null)
    try {
      const res = await fetch(`${getApiUrl()}/api/applications`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.status === 403) {
        toast.error('Not authorized to view applications.')
        setLoading(false)
        return
      }
      if (res.status === 401) {
        toast.error('Session expired. Sign in again.')
        setLoading(false)
        return
      }
      if (!res.ok) {
        toast.error('Could not load applications.')
        setLoading(false)
        return
      }
      const data = (await res.json()) as Row[]
      setRows(data)
    } catch {
      toast.error('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t border-brand-green/10 pt-6">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          if (!open && rows === null && !loading) void load()
        }}
        className="text-left text-sm font-bold text-brand-green-mid underline decoration-brand-yellow decoration-2 underline-offset-4 hover:text-brand-green"
      >
        {open ? 'Hide applications' : 'View applications (admin)'}
      </button>

      {open && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="mb-4 rounded-lg bg-brand-yellow px-4 py-2 text-sm font-bold text-brand-green hover:bg-brand-yellow-deep disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
          {rows && rows.length === 0 && (
            <p className="text-sm text-brand-green/80">No applications yet.</p>
          )}
          {rows && rows.length > 0 && (
            <div className="max-h-80 overflow-auto rounded-xl border border-brand-green/15">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-brand-cream">
                  <tr>
                    <th className="p-2 font-semibold">Name</th>
                    <th className="p-2 font-semibold">Email</th>
                    <th className="p-2 font-semibold">Type</th>
                    <th className="p-2 font-semibold">CV</th>
                    <th className="p-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-brand-green/10">
                      <td className="p-2 align-top">{r.full_name}</td>
                      <td className="p-2 align-top break-all">{r.email}</td>
                      <td className="p-2 align-top capitalize">{r.type}</td>
                      <td className="p-2 align-top">
                        {r.cv_path ? (
                          <span className="text-xs font-semibold text-brand-green/80">Attached</span>
                        ) : (
                          <span className="text-xs text-brand-green/60">—</span>
                        )}
                      </td>
                      <td className="p-2 align-top whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

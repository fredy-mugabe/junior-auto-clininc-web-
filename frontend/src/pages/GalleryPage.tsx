import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { getApiUrl } from '../lib/constants'
import { MarketingHero } from '../components/MarketingHero'
import { listContainer, listItem } from '../lib/motion'

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface GalleryImage {
  id: string
  url: string
  caption: string | null
  created_at: string
  /** Supabase Storage object path — returned by the API, used for deletion. */
  storage_path?: string | null
}

/* ─── SQL hint (run once in Supabase SQL Editor) ───────────────────────────
  -- 1. Create the gallery_images table
  CREATE TABLE IF NOT EXISTS gallery_images (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    url        text NOT NULL,
    caption    text,
    created_at timestamptz NOT NULL DEFAULT now()
  );

  -- 2. Enable RLS
  ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

  -- 3. Public read
  CREATE POLICY "Public read gallery" ON gallery_images
    FOR SELECT USING (true);

  -- 4. Admin insert (replace with your admin email)
  CREATE POLICY "Admin insert gallery" ON gallery_images
    FOR INSERT WITH CHECK (auth.email() = 'your-admin@email.com');

  -- 5. Admin delete
  CREATE POLICY "Admin delete gallery" ON gallery_images
    FOR DELETE USING (auth.email() = 'your-admin@email.com');

  -- 6. Storage bucket: create a bucket named "gallery" set to Public in the
  --    Supabase dashboard Storage → New bucket → "gallery" → enable Public.
  --    Then add Storage policies for INSERT / DELETE for your admin email.
─────────────────────────────────────────────────────────────────────────── */

/* ─── Icon helpers ─────────────────────────────────────────────────────────── */
function IconLock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function IconUnlock({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}
function IconX({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconTrash({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  )
}
function IconUpload({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}
function IconChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}
function IconChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}
function IconImage({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

/* ─── Skeleton card ─────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="gallery-card overflow-hidden rounded-2xl border border-white/10 bg-white/5 animate-pulse">
      <div className="aspect-[4/3] w-full bg-white/8" />
      <div className="p-3">
        <div className="h-3 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  )
}

/* ─── Lightbox ──────────────────────────────────────────────────────────────── */
interface LightboxProps {
  images: GalleryImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}
function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[index]
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        id="gallery-lightbox-close"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 transition hover:bg-black/80 hover:text-white"
        aria-label="Close lightbox"
      >
        <IconX className="h-5 w-5" />
      </button>

      {/* Prev */}
      <button
        id="gallery-lightbox-prev"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 transition hover:bg-black/80 hover:text-white"
        aria-label="Previous image"
      >
        <IconChevronLeft className="h-6 w-6" />
      </button>

      {/* Image */}
      <motion.div
        key={img.id}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative mx-20 flex max-h-[88vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={img.caption ?? 'Gallery photo'}
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
        />
        {img.caption && (
          <p className="mt-4 text-center text-sm font-medium text-white/75">{img.caption}</p>
        )}
        <p className="mt-1 text-xs text-white/35">{index + 1} / {images.length}</p>
      </motion.div>

      {/* Next */}
      <button
        id="gallery-lightbox-next"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 transition hover:bg-black/80 hover:text-white"
        aria-label="Next image"
      >
        <IconChevronRight className="h-6 w-6" />
      </button>
    </motion.div>
  )
}

/* ─── Admin Login Modal ──────────────────────────────────────────────────────── */
interface LoginModalProps {
  onClose: () => void
  onSuccess: () => void
}
function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      onSuccess()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="jac-surface relative w-full max-w-sm p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="gallery-login-close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:text-white"
          aria-label="Close login"
        >
          <IconX className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4a93c]/40 bg-black/40">
            <IconLock className="h-5 w-5 text-[#d4a93c]" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Admin Login</h2>
            <p className="text-xs text-white/55">Gallery management access</p>
          </div>
        </div>

        <form id="gallery-admin-login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="gallery-admin-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/60">
              Email
            </label>
            <input
              id="gallery-admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#d4a93c]/60 focus:ring-2 focus:ring-[#d4a93c]/20"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="gallery-admin-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/60">
              Password
            </label>
            <input
              id="gallery-admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#d4a93c]/60 focus:ring-2 focus:ring-[#d4a93c]/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/25 bg-red-950/50 px-3 py-2 text-xs text-red-300">{error}</p>
          )}

          <button
            id="gallery-admin-login-submit"
            type="submit"
            disabled={loading}
            className="jac-btn jac-btn--primary mt-2 w-full py-3 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in as Admin'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─── Upload Zone ────────────────────────────────────────────────────────────── */
interface UploadZoneProps {
  onUploaded: (img: GalleryImage) => void
}
function UploadZone({ onUploaded }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setError(null)
    setUploading(true)
    setProgress(15)

    try {
      // Get the current admin session token
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) {
        setError('Session expired — please sign in again.')
        setUploading(false)
        setProgress(0)
        return
      }

      // Build multipart FormData — image + optional caption
      const formData = new FormData()
      formData.append('image', file)
      if (caption.trim()) formData.append('caption', caption.trim())

      setProgress(30)

      const res = await fetch(`${getApiUrl()}/api/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      setProgress(90)

      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = json.hint
          ? `${json.error} — ${json.hint}`
          : json.error || `Upload failed (${res.status})`
        setError(msg)
        setProgress(0)
        setUploading(false)
        return
      }

      setProgress(100)
      setUploading(false)
      setCaption('')
      setProgress(0)
      onUploaded(json.image as GalleryImage)
    } catch (err) {
      console.error('[Gallery] upload error:', err)
      setError('Network error — could not reach the server. Please try again.')
      setProgress(0)
      setUploading(false)
    }
  }, [caption, onUploaded])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  return (
    <div className="mb-10 rounded-2xl border border-[#d4a93c]/30 bg-[#d4a93c]/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d4a93c]/40 bg-black/40">
          <IconUpload className="h-4 w-4 text-[#d4a93c]" />
        </span>
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#d4a93c]">Upload Photo</h3>
      </div>

      {/* Caption input */}
      <input
        id="gallery-upload-caption"
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption (optional)"
        className="mb-4 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#d4a93c]/60 focus:ring-2 focus:ring-[#d4a93c]/20"
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={[
          'flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition select-none',
          dragging ? 'border-[#d4a93c]/80 bg-[#d4a93c]/10' : 'border-white/20 hover:border-[#d4a93c]/50 hover:bg-white/[0.03]',
          uploading ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
        role="button"
        aria-label="Drop image here or click to browse"
      >
        <IconUpload className="h-8 w-8 text-white/40" />
        <p className="text-sm text-white/60">
          {uploading ? 'Uploading…' : 'Drag & drop or click to browse'}
        </p>
        <p className="text-xs text-white/35">PNG, JPG, WebP, GIF</p>
      </div>
      <input ref={fileRef} id="gallery-file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Progress bar */}
      {uploading && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#d4a93c]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/25 bg-red-950/50 px-3 py-2 text-xs text-red-300">{error}</p>
      )}
    </div>
  )
}

/* ─── Main Gallery Page ──────────────────────────────────────────────────────── */
export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  /* ── Auth state ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user
      if (user) { setIsAdmin(true); setAdminEmail(user.email ?? null) }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setIsAdmin(true); setAdminEmail(session.user.email ?? null) }
      else { setIsAdmin(false); setAdminEmail(null) }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  /* ── Fetch images via API (server-side, uses service role) ── */
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl()}/api/gallery`)
      if (res.ok) {
        const json = await res.json()
        setImages((json.items ?? []) as GalleryImage[])
      } else {
        console.error('[Gallery] fetchImages error:', res.status)
      }
    } catch (err) {
      console.error('[Gallery] fetchImages network error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  /* ── Handlers ── */
  const handleUploaded = (img: GalleryImage) => setImages((prev) => [img, ...prev])

  const handleDelete = async (img: GalleryImage) => {
    if (!window.confirm(`Delete "${img.caption ?? 'this photo'}"?`)) return
    setDeletingId(img.id)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) {
        alert('Session expired — please sign in again.')
        setDeletingId(null)
        return
      }

      const res = await fetch(`${getApiUrl()}/api/gallery`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: img.id,
          storage_path: img.storage_path ?? undefined,
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        alert(json.error || `Delete failed (${res.status})`)
        setDeletingId(null)
        return
      }

      setImages((prev) => prev.filter((i) => i.id !== img.id))
    } catch (err) {
      console.error('[Gallery] delete error:', err)
      alert('Network error — could not reach the server.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prevImage = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : images.length - 1))
  const nextImage = () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : 0))

  return (
    <>
      {/* ─── Hero ─── */}
      <MarketingHero
        eyebrow="Gallery"
        title="Workshop in action"
      >
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/88 md:text-xl">
          A look inside our Musanze workshop — real diagnostics, real repairs, real results.
        </p>

        {/* Admin toggle */}
        <div className="mt-6 flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-950/50 px-4 py-2 text-xs font-semibold text-emerald-300">
                <IconUnlock className="h-3.5 w-3.5" />
                Admin: {adminEmail}
              </span>
              <button
                id="gallery-logout-btn"
                onClick={handleLogout}
                className="jac-btn jac-btn--ghost px-4 py-2 text-xs"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              id="gallery-admin-login-btn"
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-semibold text-white/60 backdrop-blur-sm transition hover:border-white/40 hover:text-white/85"
            >
              <IconLock className="h-3.5 w-3.5" />
              Admin
            </button>
          )}
        </div>
      </MarketingHero>

      {/* ─── Gallery body ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">

        {/* Upload zone (admin only) */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <UploadZone onUploaded={handleUploaded} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-6 py-28 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5">
              <IconImage className="h-10 w-10 text-white/30" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white/70">No photos yet</h3>
              <p className="mt-2 text-sm text-white/40">
                {isAdmin ? 'Upload the first photo using the zone above.' : 'Check back soon — photos coming soon.'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="gallery-masonry-grid"
          >
            {images.map((img, idx) => (
              <motion.div
                key={img.id}
                variants={listItem}
                className="gallery-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.85)]"
              >
                {/* Image */}
                <button
                  id={`gallery-image-${img.id}`}
                  type="button"
                  className="block w-full cursor-zoom-in"
                  onClick={() => openLightbox(idx)}
                  aria-label={`View ${img.caption ?? 'photo'} fullscreen`}
                >
                  <img
                    src={img.url}
                    alt={img.caption ?? 'Workshop photo'}
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </button>

                {/* Hover overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Caption */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="text-xs font-medium text-white/90 drop-shadow">{img.caption}</p>
                  </div>
                )}

                {/* Admin delete button */}
                {isAdmin && (
                  <button
                    id={`gallery-delete-${img.id}`}
                    type="button"
                    onClick={() => handleDelete(img)}
                    disabled={deletingId === img.id}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-500/40 bg-red-950/80 text-red-400 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:bg-red-900 hover:text-red-200 disabled:opacity-40"
                    aria-label="Delete photo"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={() => setShowLogin(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  )
}

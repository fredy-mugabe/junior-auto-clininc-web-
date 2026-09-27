import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl } from '../lib/constants'
import { MarketingHero } from '../components/MarketingHero'
import { listContainer, listItem } from '../lib/motion'
import { GALLERY_SEED_IMAGES } from '../lib/gallerySeed'

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
function IconX({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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

/* ─── Main Gallery Page ──────────────────────────────────────────────────────── */
export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  /* ── Fetch images via API (server-side, uses service role) ── */
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl()}/api/gallery`)
      if (res.ok) {
        const json = await res.json()
        setImages([...GALLERY_SEED_IMAGES, ...((json.items ?? []) as GalleryImage[])])
      } else {
        console.error('[Gallery] fetchImages error:', res.status)
        // Still show the built-in photos even if the API/DB isn't reachable.
        setImages([...GALLERY_SEED_IMAGES])
      }
    } catch (err) {
      console.error('[Gallery] fetchImages network error:', err)
      setImages([...GALLERY_SEED_IMAGES])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

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
      </MarketingHero>

      {/* ─── Gallery body ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">

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
              <p className="mt-2 text-sm text-white/40">Check back soon — photos coming soon.</p>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ─── Modals ─── */}
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

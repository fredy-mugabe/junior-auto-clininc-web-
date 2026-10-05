import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getApiUrl } from '../lib/constants'
import { MarketingHero } from '../components/MarketingHero'
import { listContainer, listItem, heroContainer, heroItem, tapSquish } from '../lib/motion'
import { GALLERY_SEED_IMAGES } from '../lib/gallerySeed'

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface GalleryImage {
  id: string
  url: string
  /** Lightweight version for grid thumbnails — falls back to `url` when absent (e.g. admin uploads). */
  thumbUrl?: string
  caption: string | null
  created_at: string
  category?: string
  featured?: boolean
  /** Supabase Storage object path — returned by the API, used for deletion. */
  storage_path?: string | null
}

const UPLOADS_CATEGORY = 'Community Uploads'

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
function IconCalendar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M16 2.5v4M8 2.5v4M3 9.5h18" />
    </svg>
  )
}
function IconMapPin({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.75" />
    </svg>
  )
}
function IconPhotos({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="15" height="14" rx="2" />
      <path d="M3 16V5a1 1 0 0 1 1-1h11" />
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
        className="relative mx-16 flex max-h-[88vh] max-w-[90vw] flex-col items-center md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={img.caption ?? 'Gallery photo'}
          className="max-h-[76vh] max-w-full rounded-2xl object-contain shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]"
        />
        {img.category && (
          <span className="mt-4 inline-flex items-center rounded-full border border-[#d4a93c]/40 bg-[#d4a93c]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#f0dc9c]">
            {img.category}
          </span>
        )}
        {img.caption && (
          <p className="mt-3 max-w-2xl text-center text-sm font-medium text-white/80">{img.caption}</p>
        )}
        <p className="mt-2 text-xs text-white/35">{index + 1} / {images.length}</p>
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
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  /* ── Fetch images via API (server-side, uses service role) ── */
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${getApiUrl()}/api/gallery`)
      const uploaded: GalleryImage[] = res.ok
        ? ((await res.json()).items ?? []).map((i: GalleryImage) => ({ ...i, category: UPLOADS_CATEGORY }))
        : []
      if (!res.ok) console.error('[Gallery] fetchImages error:', res.status)
      setImages([...GALLERY_SEED_IMAGES, ...uploaded])
    } catch (err) {
      console.error('[Gallery] fetchImages network error:', err)
      setImages([...GALLERY_SEED_IMAGES])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  /* ── Derived data ── */
  const categories = useMemo(() => {
    const seen = new Set<string>()
    images.forEach((img) => { if (img.category) seen.add(img.category) })
    return ['All', ...Array.from(seen)]
  }, [images])

  const featuredImage = useMemo(() => images.find((img) => img.featured) ?? null, [images])

  const filteredImages = useMemo(
    () => (activeCategory === 'All' ? images : images.filter((img) => img.category === activeCategory)),
    [images, activeCategory],
  )

  const openLightbox = (img: GalleryImage) => setLightboxImage(img)
  const closeLightbox = () => setLightboxImage(null)
  const currentIndex = lightboxImage ? filteredImages.findIndex((i) => i.id === lightboxImage.id) : -1
  const prevImage = () => {
    if (currentIndex < 0) return
    setLightboxImage(filteredImages[currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1])
  }
  const nextImage = () => {
    if (currentIndex < 0) return
    setLightboxImage(filteredImages[currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0])
  }

  const eventDate = useMemo(() => {
    const dates = GALLERY_SEED_IMAGES.map((i) => new Date(i.created_at))
    const earliest = dates.reduce((a, b) => (a < b ? a : b), dates[0])
    return earliest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }, [])

  return (
    <>
      {/* ─── Hero ─── */}
      <MarketingHero eyebrow="Gallery" title="Moments from the workshop floor">
        <motion.div variants={heroContainer} initial="hidden" animate="show">
          <motion.p variants={heroItem} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/88 md:text-xl">
            Real diagnostics, real repairs, and the day Junior Auto Clinique became a Toyota Rwanda
            authorized partner in Musanze.
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-3">
            <div className="jac-surface flex items-center gap-3 px-4 py-3">
              <span className="jac-icon-tile h-9 w-9"><IconPhotos className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-bold text-white">{images.length || GALLERY_SEED_IMAGES.length}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-white/45">Photos</p>
              </div>
            </div>
            <div className="jac-surface flex items-center gap-3 px-4 py-3">
              <span className="jac-icon-tile h-9 w-9"><IconCalendar className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-bold text-white">{eventDate}</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-white/45">Partnership signed</p>
              </div>
            </div>
            <div className="jac-surface flex items-center gap-3 px-4 py-3">
              <span className="jac-icon-tile h-9 w-9"><IconMapPin className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-bold text-white">Musanze</p>
                <p className="text-[0.65rem] uppercase tracking-widest text-white/45">Location</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </MarketingHero>

      {/* ─── Featured banner ─── */}
      {featuredImage && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl px-5 pt-14 md:px-8 md:pt-20"
        >
          <button
            id="gallery-featured-banner"
            type="button"
            onClick={() => openLightbox(featuredImage)}
            className="group relative block w-full overflow-hidden rounded-2xl border border-[#d4a93c]/25 text-left"
          >
            <img
              src={featuredImage.url}
              alt={featuredImage.caption ?? 'Featured photo'}
              style={{ objectPosition: '50% 15%' }}
              className="h-[280px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[420px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="inline-flex items-center rounded-full border border-[#d4a93c]/50 bg-black/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-[#f0dc9c] backdrop-blur-sm">
                Now a Toyota Rwanda Authorized Partner
              </span>
              <p className="mt-3 max-w-2xl text-base font-medium text-white/92 md:text-lg">
                {featuredImage.caption}
              </p>
            </div>
          </button>
        </motion.section>
      )}

      {/* ─── Gallery body ─── */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">

        {/* Filter chips */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = cat === activeCategory
              return (
                <motion.button
                  key={cat}
                  type="button"
                  id={`gallery-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  whileTap={tapSquish}
                  className={active ? 'jac-btn jac-btn--primary px-4 py-2 text-xs' : 'jac-btn jac-btn--ghost px-4 py-2 text-xs'}
                >
                  {cat}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredImages.length === 0 ? (
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
            key={activeCategory}
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="gallery-masonry-grid"
          >
            {filteredImages.map((img) => (
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
                  onClick={() => openLightbox(img)}
                  aria-label={`View ${img.caption ?? 'photo'} fullscreen`}
                >
                  <img
                    src={img.thumbUrl ?? img.url}
                    alt={img.caption ?? 'Workshop photo'}
                    width={640}
                    height={480}
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
        {lightboxImage && currentIndex >= 0 && (
          <Lightbox
            images={filteredImages}
            index={currentIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  )
}

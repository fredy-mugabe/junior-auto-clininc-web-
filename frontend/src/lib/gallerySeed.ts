/**
 * Built-in gallery photos from the Junior Auto Clinique × Toyota Rwanda
 * partnership event (Musanze, March 2026). These ship with the site so the
 * Gallery always has content, independent of the Supabase-backed uploads.
 *
 * Each entry mirrors the shape of a Supabase `gallery_images` row so it can
 * be merged directly into the GalleryPage's image list. `id` is prefixed
 * with "seed-" so the UI can tell these apart from admin-uploaded photos
 * (e.g. to hide the delete button, since there's nothing to delete).
 */
export interface SeedGalleryImage {
  id: string
  url: string
  caption: string
  created_at: string
}

export const GALLERY_SEED_IMAGES: SeedGalleryImage[] = [
  {
    id: 'seed-01',
    url: '/gallery-seed/jac-toyota-01.jpg',
    caption: 'A Junior Auto Clinique team lead takes the floor to brief the Musanze staff ahead of the Toyota partnership signing.',
    created_at: '2026-03-10T08:00:00Z',
  },
  {
    id: 'seed-02',
    url: '/gallery-seed/jac-toyota-02.jpg',
    caption: 'Guests wait their turn as the partnership documents are prepared — a quiet moment before the signatures.',
    created_at: '2026-03-10T08:05:00Z',
  },
  {
    id: 'seed-03',
    url: '/gallery-seed/jac-toyota-03.jpg',
    caption: 'Toyota Rwanda\'s Managing Director addresses the room, with the Toyota banner marking the occasion behind him.',
    created_at: '2026-03-10T08:10:00Z',
  },
  {
    id: 'seed-04',
    url: '/gallery-seed/jac-toyota-04.jpg',
    caption: 'Pen to paper — the Junior Auto Clinique and Toyota Rwanda partnership agreement gets its first signatures.',
    created_at: '2026-03-10T08:20:00Z',
  },
  {
    id: 'seed-05',
    url: '/gallery-seed/jac-toyota-05.jpg',
    caption: 'A handshake seals the deal as the signed agreement changes hands, met with applause from the room.',
    created_at: '2026-03-10T08:22:00Z',
  },
  {
    id: 'seed-06',
    url: '/gallery-seed/jac-toyota-06.jpg',
    caption: 'Junior Auto Clinique and Toyota Rwanda leadership shake hands, each holding their signed copy of the partnership agreement.',
    created_at: '2026-03-10T08:24:00Z',
  },
  {
    id: 'seed-07',
    url: '/gallery-seed/jac-toyota-07.jpg',
    caption: 'A warm exchange between the two Managing Directors moments after the partnership was made official.',
    created_at: '2026-03-10T08:25:00Z',
  },
  {
    id: 'seed-08',
    url: '/gallery-seed/jac-toyota-08.jpg',
    caption: 'Holding up the signed agreement: Junior Auto Clinique is now an official Toyota Rwanda partner in Musanze.',
    created_at: '2026-03-10T08:26:00Z',
  },
  {
    id: 'seed-09',
    url: '/gallery-seed/jac-toyota-09.jpg',
    caption: 'A portrait of Toyota Rwanda\'s Managing Director, in Musanze for the signing of the new service partnership.',
    created_at: '2026-03-10T08:30:00Z',
  },
  {
    id: 'seed-10',
    url: '/gallery-seed/jac-toyota-10.jpg',
    caption: 'A Junior Auto Clinique representative, badge on his chest, at the partnership ceremony.',
    created_at: '2026-03-10T08:32:00Z',
  },
  {
    id: 'seed-11',
    url: '/gallery-seed/jac-toyota-11.jpg',
    caption: 'The Junior Auto Clinique workshop team, in uniform, gathered to hear what the new Toyota partnership means for them.',
    created_at: '2026-03-10T08:40:00Z',
  },
  {
    id: 'seed-12',
    url: '/gallery-seed/jac-toyota-12.jpg',
    caption: 'The workshop floor breaks into applause as the announcement is made under the Toyota banner.',
    created_at: '2026-03-10T08:42:00Z',
  },
  {
    id: 'seed-13',
    url: '/gallery-seed/jac-toyota-13.jpg',
    caption: 'Visitors look over "Now in Musanze" leaflets introducing Junior Auto Clinique as a Toyota Rwanda authorized service center.',
    created_at: '2026-03-10T08:45:00Z',
  },
  {
    id: 'seed-14',
    url: '/gallery-seed/jac-toyota-14.jpg',
    caption: 'Smiles all around as the group reads through the details of the new Toyota Quality Care service promise.',
    created_at: '2026-03-10T08:46:00Z',
  },
  {
    id: 'seed-15',
    url: '/gallery-seed/jac-toyota-15.jpg',
    caption: 'The full Junior Auto Clinique Musanze team lines up with Toyota Rwanda leadership outside the workshop to mark the day.',
    created_at: '2026-03-10T09:00:00Z',
  },
  {
    id: 'seed-16',
    url: '/gallery-seed/jac-toyota-16.jpg',
    caption: 'Under the "Now in Musanze" banner, staff and partners pose together in front of the garage.',
    created_at: '2026-03-10T09:02:00Z',
  },
  {
    id: 'seed-17',
    url: '/gallery-seed/jac-toyota-17.jpg',
    caption: 'Leadership from both companies stand together beside the Toyota Rwanda banner after the signing.',
    created_at: '2026-03-10T09:10:00Z',
  },
  {
    id: 'seed-18',
    url: '/gallery-seed/jac-toyota-18.jpg',
    caption: 'A closing group photo marking Junior Auto Clinique\'s new status as a Toyota Rwanda Authorized Service Center in Musanze.',
    created_at: '2026-03-10T09:12:00Z',
  },
]

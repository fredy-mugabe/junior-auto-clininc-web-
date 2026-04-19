import { motion } from 'framer-motion'
import {
  IconAward,
  IconBuilding,
  IconClipboard,
  IconShield,
  IconUsers,
} from '../components/ClassicIcons'
import { PageHero } from '../components/PageHero'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { About } from '../sections/About'
import { getGoogleMapsEmbedSrc } from '../lib/constants'
import { GARAGE_IMAGES } from '../lib/garageImages'

const highlights = [
  {
    title: 'Workshop scale',
    blurb: 'Multiple bays, organized intake, and space for fleet-sized jobs.',
    Icon: IconBuilding,
  },
  {
    title: 'People-first culture',
    blurb: 'Technicians and advisors train together on clear communication.',
    Icon: IconUsers,
  },
  {
    title: 'Documented quality',
    blurb: 'Inspection notes and sign-offs you can file for insurance or resale.',
    Icon: IconClipboard,
  },
  {
    title: 'Recognition mindset',
    blurb: 'We pursue manufacturer-aligned methods and continuous improvement.',
    Icon: IconAward,
  },
] as const

const values = [
  {
    text: 'Quality-first repairs with tested parts',
    Icon: IconShield,
  },
  {
    text: 'Customer updates at each major service stage',
    Icon: IconClipboard,
  },
  {
    text: 'Safety checks before every handover',
    Icon: IconShield,
  },
  {
    text: 'Clean, organized and technology-enabled workshop',
    Icon: IconBuilding,
  },
] as const

export function AboutPage() {
  return (
    <>
      <PageHero
        bgUrl={GARAGE_IMAGES.heroAbout}
        eyebrow="About"
        title="Built for precision and trust"
        subtitle="We built JUNIOR AUTO CLINIQUE ltd around a simple idea: drivers should understand what is happening with their vehicle before money changes hands. That means disciplined inspections, evidence-based diagnostics, and advisors who translate technician findings into clear choices."
        subtitleSecondary="Whether you are visiting for a warning light, a pre-trip check, or a long-term maintenance plan, our team focuses on consistency — the same standards on busy days and quiet ones — so you can book with confidence and recommend us to family or colleagues without hesitation."
      />

      <section className="border-y border-emerald-500/20 bg-[#051616]/55 px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ title, blurb, Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-2xl border border-emerald-500/25 bg-black/25 p-5 backdrop-blur-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#F4D03F]/35 bg-[#051616]/80 text-[#F4D03F]">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{blurb}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <About />

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentAbout} className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-stretch md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-7 shadow-xl backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-white">Our mission</h3>
            <p className="mt-4 leading-relaxed text-white/88">
              Our mission is to deliver dependable, modern automotive service while investing in people —
              through internships, mentorship, and career paths for technicians who want to grow with the
              industry. We believe a strong workshop is both a service business and a training ground where
              standards are taught, not assumed.
            </p>
            <p className="mt-4 leading-relaxed text-white/85">
              That dual focus benefits customers directly: a team that is learning on structured programs
              is also a team that follows checklists, asks questions, and escalates unusual cases instead
              of improvising at your expense.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/78">
              Visitors often ask how we stay consistent when volume is high. The answer is simple on paper
              and demanding in practice: standard operating steps for lifts and fluids, photography when
              wear is borderline, and a second set of eyes on high-risk jobs before keys are returned.
            </p>
            <ul className="mt-6 space-y-3 text-white/85">
              {values.map(({ text, Icon }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/35 text-[#F4D03F]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            viewport={{ once: true }}
            className="flex min-h-[280px] flex-col overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#051616]/80 shadow-xl backdrop-blur-md md:min-h-0"
            aria-labelledby="about-location-heading"
          >
            <div className="border-b border-emerald-500/20 px-5 py-4 md:px-6">
              <h3 id="about-location-heading" className="text-xl font-bold text-white md:text-2xl">
                Our location
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/75">
                Visit the workshop here. Zoom and directions are available inside the map.
              </p>
            </div>
            <div className="relative min-h-[280px] flex-1 sm:min-h-[320px] md:min-h-[360px]">
              <iframe
                title="JUNIOR AUTO CLINIQUE ltd location on Google Maps"
                src={getGoogleMapsEmbedSrc()}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </StockSectionBackdrop>
    </>
  )
}

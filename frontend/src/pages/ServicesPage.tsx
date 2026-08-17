import { motion } from 'framer-motion'
import { IconClipboard, IconSparkle, IconTruck, IconWrench } from '../components/ClassicIcons'
import { PageHero } from '../components/PageHero'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { Services } from '../sections/Services'
import { GARAGE_IMAGES } from '../lib/garageImages'
import { listContainer, listItem, sectionReveal } from '../lib/motion'

const serviceStrip = [
  { label: 'Structured diagnostics', Icon: IconSparkle },
  { label: 'Parts discipline', Icon: IconWrench },
  { label: 'Written findings', Icon: IconClipboard },
  { label: 'Fleet-ready workflows', Icon: IconTruck },
] as const

const packages = [
  {
    name: 'Essential care package',
    details:
      'Covers oil and filter service, brake inspection, battery and charging test, and a 30-point safety review. Ideal for drivers who want a seasonal health check and early warning of wear items before they become roadside problems or costly compound failures.',
    Icon: IconClipboard,
  },
  {
    name: 'Engine performance package',
    details:
      'Includes diagnostics scan, ignition and fuel system checks, cooling system assessment, and tailored recommendations for performance or economy. Suited to vehicles with rough running, reduced power, or intermittent warnings where a structured baseline saves time and money.',
    Icon: IconSparkle,
  },
  {
    name: 'Fleet maintenance package',
    details:
      'Provides scheduled maintenance cycles, documented service history, and preventive repair planning for business vehicles. We help fleet operators reduce downtime, plan budgets, and keep drivers in safer, more reliable units without constant emergency repairs.',
    Icon: IconTruck,
  },
] as const

export function ServicesPage() {
  return (
    <>
      <PageHero
        bgUrl={GARAGE_IMAGES.heroServices}
        eyebrow="Services"
        title="Diagnostics, repairs, and maintenance"
        subtitle="From routine care to complex repairs, we combine structured workflows with honest communication. You will know what we found, what we recommend now versus later, and what each option costs — before we turn a wrench."
        subtitleSecondary="Our technicians work with quality parts appropriate to each job, retest systems after repair, and document outcomes so you have a clear record for warranty, resale, or your own peace of mind."
      />

      <section className="jac-section-band px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 md:gap-10">
          {serviceStrip.map(({ label, Icon }) => (
            <div key={label} className="flex items-center gap-3 text-white/90">
              <span className="jac-icon-tile h-11 w-11">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <Services />

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentServices} className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.h2 {...sectionReveal()} className="text-3xl font-bold text-white md:text-4xl">
            Detailed service programs
          </motion.h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/90">
            Bundled programs help owners who prefer predictable costs and fewer surprises. Instead of
            reacting to every symptom in isolation, we align maintenance with manufacturer guidance and your
            driving patterns — adjusting intervals when dust, heat, or short trips stress components
            faster than a generic schedule assumes.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            If you are comparing garages, ask how each package is documented and what is included after
            the work is done. We prioritize clarity: written findings, prioritized recommendations, and
            follow-up guidance so you know when to return before the next major interval.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/78 md:text-base">
            Heavy-duty users — taxis, delivery vans, and hill-country commuters — often benefit from
            shortened fluid intervals and closer brake inspections. Tell us how you use the vehicle and we
            will align the package to real conditions, not only the factory sticker under the hood.
          </p>

          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {packages.map((pkg) => {
              const CardIcon = pkg.Icon
              return (
                <motion.article key={pkg.name} variants={listItem} className="jac-surface p-6">
                  <span className="jac-icon-tile h-11 w-11">
                    <CardIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/82 md:text-[0.9375rem]">
                    {pkg.details}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>
        </div>
      </StockSectionBackdrop>
    </>
  )
}

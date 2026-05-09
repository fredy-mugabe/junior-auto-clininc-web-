import { motion } from 'framer-motion'
import { IconBriefcase, IconGraduation, IconTrending } from '../components/ClassicIcons'
import { MarketingHero } from '../components/MarketingHero'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { ApplySection } from '../sections/ApplySection'
import { GARAGE_IMAGES } from '../lib/garageImages'
import { listContainer, listItem } from '../lib/motion'

export function CareersPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Apply"
        title="Careers & internships"
        lead={
          <div className="flex flex-wrap gap-3 text-[#F4D03F]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <IconGraduation className="h-4 w-4" aria-hidden />
              Learn
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <IconBriefcase className="h-4 w-4" aria-hidden />
              Build
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm">
              <IconTrending className="h-4 w-4" aria-hidden />
              Grow
            </span>
          </div>
        }
      >
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
          Join a workshop where mentorship, safety, and quality standards are part of every shift.
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/82 md:text-lg">
          We hire for attitude and train for skill: punctuality, respect for tools, and willingness to read
          service information instead of guessing. If that sounds like you, the application form below is the
          fastest route to a conversation with our team.
        </p>
      </MarketingHero>

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentCareers} className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            We divide growth paths intentionally so expectations stay clear. Interns work under close
            supervision with progressive responsibility; experienced hires plug into leadership and specialty
            work where their judgment matters most.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            Across every track, we emphasize documentation, tool care, and customer-facing professionalism —
            because technical skill only scales when habits and communication keep pace.
          </p>

          <motion.div
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            <motion.article variants={listItem} className="jac-surface p-6">
              <span className="jac-icon-tile h-11 w-11">
                <IconGraduation className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">Internship track</h3>
              <p className="mt-3 leading-relaxed text-white/82">
                Supervised rotations through diagnostics, maintenance routines, and workshop safety — with
                checklists and sign-offs so you build muscle memory the right way.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Interns who demonstrate reliability and curiosity can advance into paid roles with expanded
                responsibility on live customer work.
              </p>
            </motion.article>
            <motion.article variants={listItem} className="jac-surface p-6">
              <span className="jac-icon-tile h-11 w-11">
                <IconBriefcase className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">Professional track</h3>
              <p className="mt-3 leading-relaxed text-white/82">
                Openings for skilled mechanics, electrical and diagnostics specialists, and service advisors who
                can translate technical detail for customers without overselling.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                We look for people who take ownership of outcomes — including comebacks — and who help junior
                staff improve.
              </p>
            </motion.article>
            <motion.article variants={listItem} className="jac-surface p-6">
              <span className="jac-icon-tile h-11 w-11">
                <IconTrending className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">Growth culture</h3>
              <p className="mt-3 leading-relaxed text-white/82">
                Continuous learning through manufacturer updates, internal case reviews, and mentorship from
                senior technicians who still work on the floor.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Quality standards are explicit: torque specs, test drives, and sign-off steps are not optional
                extras.
              </p>
            </motion.article>
          </motion.div>
        </div>
      </StockSectionBackdrop>

      <ApplySection />
    </>
  )
}

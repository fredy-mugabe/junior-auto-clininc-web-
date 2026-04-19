import { motion } from 'framer-motion'
import { IconBriefcase, IconGraduation, IconTrending } from '../components/ClassicIcons'
import { StockSectionBackdrop } from '../components/StockSectionBackdrop'
import { ApplySection } from '../sections/ApplySection'
import { GARAGE_IMAGES } from '../lib/garageImages'

export function CareersPage() {
  return (
    <>
      <motion.section
        className="relative overflow-hidden rounded-none px-4 py-16 md:px-8 md:py-24"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#051616] via-[#08221e] to-[#051616]" aria-hidden />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-4 text-[#F4D03F]">
            <span className="flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
              <IconGraduation className="h-4 w-4" aria-hidden />
              Learn
            </span>
            <span className="flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
              <IconBriefcase className="h-4 w-4" aria-hidden />
              Build
            </span>
            <span className="flex items-center gap-2 rounded-full border border-[#F4D03F]/35 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
              <IconTrending className="h-4 w-4" aria-hidden />
              Grow
            </span>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]">Apply</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Careers & internships
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/92 md:text-xl">
            Join a workshop where mentorship, safety, and quality standards are part of every shift.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/82 md:text-lg">
            We hire for attitude and train for skill: punctuality, respect for tools, and willingness to
            read service information instead of guessing. If that sounds like you, the application form
            below is the fastest route to a conversation with our team.
          </p>
        </div>
      </motion.section>

      <StockSectionBackdrop bgUrl={GARAGE_IMAGES.contentCareers} className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="max-w-3xl text-lg leading-relaxed text-white/90">
            We divide growth paths intentionally so expectations stay clear. Interns work under close
            supervision with progressive responsibility; experienced hires plug into leadership and
            specialty work where their judgment matters most.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85 md:text-lg">
            Across every track, we emphasize documentation, tool care, and customer-facing professionalism
            — because technical skill only scales when habits and communication keep pace.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-6 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/35 text-[#F4D03F]">
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
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-6 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/35 text-[#F4D03F]">
                <IconBriefcase className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">Professional track</h3>
              <p className="mt-3 leading-relaxed text-white/82">
                Openings for skilled mechanics, electrical and diagnostics specialists, and service advisors
                who can translate technical detail for customers without overselling.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                We look for people who take ownership of outcomes — including comebacks — and who help
                junior staff improve.
              </p>
            </motion.article>
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-emerald-500/30 bg-[#051616]/80 p-6 shadow-xl backdrop-blur-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/35 text-[#F4D03F]">
                <IconTrending className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">Growth culture</h3>
              <p className="mt-3 leading-relaxed text-white/82">
                Continuous learning through manufacturer updates, internal case reviews, and mentorship
                from senior technicians who still work on the floor.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Quality standards are explicit: torque specs, test drives, and sign-off steps are not
                optional extras.
              </p>
            </motion.article>
          </div>
        </div>
      </StockSectionBackdrop>

      <ApplySection />
    </>
  )
}

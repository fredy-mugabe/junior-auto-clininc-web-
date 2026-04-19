import { COMPANY_LEGAL, EMAIL, PHONES, TIN } from '../lib/constants'

export function Footer() {
  return (
    <footer className="jac-footer border-t border-[#F4D03F]/25 py-10 text-white md:py-12">
      <div className="mx-auto grid max-w-[min(100%,1980px)] gap-10 px-4 md:grid-cols-12 md:gap-8 md:px-8 lg:px-10">
        <div className="md:col-span-4">
          <img
            src="/branding/logo-contact-strip.png"
            alt={`${COMPANY_LEGAL} contact information`}
            className="h-auto w-full max-w-[260px] object-contain object-left"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D03F]/95">
            Precision automotive care
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
            Musanze workshop — diagnostics, repair, and accountable service delivery.
          </p>
        </div>

        <div className="md:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D03F]">Executive standard</p>
          <p className="mt-3 text-sm font-semibold leading-snug text-white md:text-base">
            CEO-level quality means clarity before cost, evidence before opinion, and discipline in every bay.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/82 md:text-[0.9375rem]">
            We run the workshop like a serious operation: documented inspections, prioritized recommendations,
            and timelines you can plan around. Smart service is not louder marketing — it is structured
            workmanship, transparent reporting, and respect for your time and investment.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/78 md:text-[0.9375rem]">
            Whether you need a single repair or ongoing fleet support, you get the same standard: careful
            diagnosis, professional handover, and follow-through that builds long-term trust.
          </p>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-8 text-sm leading-relaxed md:col-span-3 md:border-t-0 md:border-l md:border-white/10 md:pt-0 md:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D03F]/90">Registered business</p>
          <p className="font-semibold text-white">{COMPANY_LEGAL}</p>
          <p>
            <span className="font-semibold text-[#F4D03F]/90">TIN:</span> {TIN}
          </p>
          <p>
            <span className="font-semibold text-[#F4D03F]/90">Phone:</span>{' '}
            <a href={`tel:${PHONES[0]}`} className="underline-offset-2 hover:underline">
              {PHONES[0]}
            </a>
          </p>
          <p className="break-words">
            <span className="font-semibold text-[#F4D03F]/90">Email:</span>{' '}
            <a href={`mailto:${EMAIL}`} className="underline-offset-2 hover:underline">
              {EMAIL}
            </a>
          </p>
          <p className="text-white/75">
            <span className="font-semibold text-[#F4D03F]/90">Hours:</span> Mon–Sat, 07:30 – 19:00
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[min(100%,1980px)] border-t border-white/12 px-4 pt-6 text-center text-xs text-white/55 md:px-8 lg:px-10">
        <p>© {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.</p>
      </div>
    </footer>
  )
}

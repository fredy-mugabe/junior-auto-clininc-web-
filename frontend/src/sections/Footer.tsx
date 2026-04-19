import { COMPANY_LEGAL, EMAIL, PHONES, TIN } from '../lib/constants'

export function Footer() {
  return (
    <footer className="jac-footer border-t border-[#F4D03F]/25 py-8 text-white">
      <div className="mx-auto flex max-w-[min(100%,1980px)] flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
        <div>
          <img
            src="/branding/logo-contact-strip.png"
            alt={`${COMPANY_LEGAL} contact information`}
            className="h-auto w-full max-w-[220px] object-contain object-left"
          />
        </div>

        <div className="space-y-2 text-sm leading-relaxed">
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
          <p>
            <span className="font-semibold text-[#F4D03F]/90">Email:</span>{' '}
            <a href={`mailto:${EMAIL}`} className="underline-offset-2 hover:underline">
              {EMAIL}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#"
            aria-label="Facebook"
            className="rounded-full border border-white/20 bg-black/25 p-2 text-white/90 transition hover:border-[#F4D03F]/80 hover:text-[#F4D03F]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M13.5 8.5V6.9c0-.8.5-1 1-1h1V3h-2.3C10.9 3 10 4.4 10 6.4v2.1H8v3h2V21h3.5v-9.5H16l.4-3h-2.9z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="rounded-full border border-white/20 bg-black/25 p-2 text-white/90 transition hover:border-[#F4D03F]/80 hover:text-[#F4D03F]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM18.4 6.8a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
              <path d="M12 2.8c3 0 3.3 0 4.5.1 1 .1 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.2.4.3 1 .4 2 .1 1.2.1 1.5.1 4.5s0 3.3-.1 4.5c-.1 1-.2 1.6-.4 2a3.4 3.4 0 0 1-2.1 2.1c-.4.2-1 .3-2 .4-1.2.1-1.5.1-4.5.1s-3.3 0-4.5-.1c-1-.1-1.6-.2-2-.4a3.4 3.4 0 0 1-2.1-2.1c-.2-.4-.3-1-.4-2C2.8 15.3 2.8 15 2.8 12s0-3.3.1-4.5c.1-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.2 1-.3 2-.4 1.2-.1 1.5-.1 4.5-.1zm0-1.8C8.9 1 8.5 1 7.3 1.1 6.1 1.1 5.3 1.3 4.7 1.6a5.2 5.2 0 0 0-3.1 3.1C1.3 5.3 1.1 6.1 1.1 7.3 1 8.5 1 8.9 1 12s0 3.5.1 4.7c0 1.2.2 2 .5 2.6a5.2 5.2 0 0 0 3.1 3.1c.6.3 1.4.5 2.6.5C8.5 23 8.9 23 12 23s3.5 0 4.7-.1c1.2 0 2-.2 2.6-.5a5.2 5.2 0 0 0 3.1-3.1c.3-.6.5-1.4.5-2.6.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1.2-.2-2-.5-2.6a5.2 5.2 0 0 0-3.1-3.1c-.6-.3-1.4-.5-2.6-.5C15.5 1 15.1 1 12 1z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="X"
            className="rounded-full border border-white/20 bg-black/25 p-2 text-white/90 transition hover:border-[#F4D03F]/80 hover:text-[#F4D03F]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.2L6.7 21H3.6l7.3-8.4L1.4 3h6.2l4.4 5.8L18.9 3zm-1.1 16.2h1.7L6.7 4.7H5l12.8 14.5z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="WhatsApp"
            className="rounded-full border border-white/20 bg-black/25 p-2 text-white/90 transition hover:border-[#F4D03F]/80 hover:text-[#F4D03F]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M20.5 3.5A11.7 11.7 0 0 0 2.2 17.7L1 23l5.4-1.1A11.7 11.7 0 1 0 20.5 3.5zm-8.8 18a9.7 9.7 0 0 1-4.9-1.3l-.4-.2-3.2.6.6-3.1-.2-.4A9.7 9.7 0 1 1 11.7 21.5zm5.3-7.2c-.3-.1-1.8-.9-2.1-1-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a7.9 7.9 0 0 1-2.3-1.4 8.8 8.8 0 0 1-1.6-2c-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2.1-.3 0-.5l-1-2.4c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.8.4 3.2 3.2 0 0 0-1 2.4c0 1.4 1 2.8 1.1 3 .1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.8 2.1-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.3z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-[min(100%,1980px)] border-t border-white/15 px-4 pt-4 text-center text-xs text-white/60 md:px-8 lg:px-10">
        <p>© {new Date().getFullYear()} {COMPANY_LEGAL}. All rights reserved.</p>
      </div>
    </footer>
  )
}

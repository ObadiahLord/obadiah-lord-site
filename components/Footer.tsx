'use client'

import { useState } from 'react'
import MagneticButton from './MagneticButton'
import IntakeForm from './IntakeForm'

export default function Footer() {
  const [open, setOpen] = useState(false)
  return (
    <footer id="contact" className="relative px-5 py-20 md:px-[110px] md:py-32">
      <div className="grid grid-cols-12 gap-10 items-end">
        <div className="col-span-12 md:col-span-7">
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Get in touch</div>
          <h2
            className="mt-6 font-light tracking-tightest leading-[0.92] text-ink"
            style={{ fontSize: 'clamp(80px, 9vw, 160px)' }}
          >
            Let&apos;s build.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-5">
          <ul className="space-y-5">
            <li>
              <div className="text-[11px] tracking-[0.18em] uppercase text-silver">Email</div>
              <a
                href="mailto:obadiahbusiness@gmail.com"
                className="text-[18px] text-ink hover:underline"
              >
                obadiahbusiness@gmail.com
              </a>
            </li>
            <li>
              <div className="text-[11px] tracking-[0.18em] uppercase text-silver">Phone</div>
              <a href="tel:7023192911" className="text-[18px] text-ink hover:underline">
                702 319 2911
              </a>
            </li>
            <li>
              <div className="text-[11px] tracking-[0.18em] uppercase text-silver">Social</div>
              <div className="flex gap-5 mt-1.5">
                <a
                  href="https://www.linkedin.com/in/obadiah-lord"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/60 hover:text-ink transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@founderscirclehq?si=kdgEWJ2tpZJaynusy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/60 hover:text-ink transition-colors"
                  aria-label="YouTube"
                >
                  <svg width="26" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/FounderObadiah"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink/60 hover:text-ink transition-colors"
                  aria-label="X"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-ink/60 hover:text-ink transition-colors"
                  aria-label="GitHub"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </a>
              </div>
            </li>
          </ul>
          <div className="mt-10">
            <MagneticButton
              onClick={() => setOpen(true)}
              className="shimmer-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-[13px] font-medium"
            >
              <>
                Book A Call <span style={{ fontVariantEmoji: 'text' }}>↗︎</span>
              </>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="mt-32 pt-8 border-t border-ink/10 flex justify-between text-[11px] tracking-[0.18em] uppercase text-silver font-mono">
        <span>© 2026 AXIS LABS</span>
        <span>Las Vegas, NV</span>
        <span>Obadiah Lord</span>
      </div>

      <IntakeForm open={open} onClose={() => setOpen(false)} />
    </footer>
  )
}

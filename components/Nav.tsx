'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'
import IntakeForm from './IntakeForm'

const links = [
  { label: 'About',           href: '#about'   },
  { label: 'Projects',        href: '#axle'    },
  { label: 'Founders Circle', href: '#circle'  },
  { label: 'Contact',         href: '#contact' },
]

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [open,      setOpen]      = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 flex h-16 items-center justify-between px-4 transition-[background,border-color,box-shadow,backdrop-filter] duration-200 md:h-20 md:px-10 ${
          scrolled ? 'nav-surface border-b border-ink/10' : 'border-b border-transparent'
        }`}
      >
        <a href="#top" onClick={scrollTo('#top')} className="flex items-center -ml-9 md:-ml-12">
          <img
            src="/images/unnamed.png"
            alt="Obadiah Lord"
            className="h-16 w-24 object-contain object-left md:h-36 md:w-36"
          />
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-9 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={scrollTo(l.href)}
                className="font-luxury-readable nav-link-gold text-[15px] cursor-pointer"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <MagneticButton
              onClick={() => setOpen(true)}
              className="shimmer-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-paper text-[13px] font-medium"
            >
              <>Book A Call <span className="text-[11px]" style={{ fontVariantEmoji: 'text' }}>↗︎</span></>
            </MagneticButton>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px bg-ink transition-all duration-300 origin-center ${menuOpen ? 'w-5 rotate-45 translate-y-[6px]' : 'w-5'}`} />
            <span className={`block h-px bg-ink transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-5'}`} />
            <span className={`block h-px bg-ink transition-all duration-300 origin-center ${menuOpen ? 'w-5 -rotate-45 -translate-y-[6px]' : 'w-5'}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="fixed top-0 inset-x-0 z-40 bg-paper pt-20 pb-8 px-6 flex flex-col border-b border-ink/10 shadow-lg md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={scrollTo(l.href)}
                className="text-[22px] font-light text-ink border-b border-ink/8 py-5 first:pt-6"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); setOpen(true) }}
              className="shimmer-btn mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-[14px] font-medium w-fit"
            >
              Book A Call <span style={{ fontVariantEmoji: 'text' }}>↗︎</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <IntakeForm open={open} onClose={() => setOpen(false)} />
    </>
  )
}

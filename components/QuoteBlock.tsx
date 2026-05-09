'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Props = {
  id?: string
  img?: string
  alt?: string
  plate: string
  eyebrow: string
  quote: ReactNode
  attribution?: string
  reverse?: boolean
  textOnly?: boolean
}

export default function QuoteBlock({
  id,
  img,
  alt,
  plate,
  eyebrow,
  quote,
  attribution,
  reverse = false,
  textOnly = false,
}: Props) {
  if (textOnly) {
    return (
      <section id={id} className="relative px-5 py-16 md:px-[110px] md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, margin: '-120px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[980px] text-center"
        >
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">{eyebrow}</div>
          <blockquote
            className="mt-6 font-light leading-[1.08] tracking-normal text-ink"
            style={{ fontSize: 'clamp(34px, 4.4vw, 72px)' }}
          >
            {quote}
          </blockquote>
          {attribution && (
            <div className="mt-8 text-[12px] tracking-[0.22em] uppercase text-silver">
              {attribution}
            </div>
          )}
        </motion.div>
      </section>
    )
  }

  return (
    <section
      id={id}
      className={`relative px-5 py-16 md:px-[110px] md:py-32 grid grid-cols-12 gap-8 md:gap-12 items-center ${
        reverse ? '' : ''
      }`}
    >
      <motion.figure
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className={`col-span-12 md:col-span-5 ${reverse ? 'md:order-2 md:col-start-8' : ''}`}
      >
        <div className="relative aspect-square overflow-hidden bg-ink/5 glass">
          <img
            src={img}
            alt={alt ?? ''}
            className="absolute inset-0 w-full h-full object-cover object-center grayscale"
          />
        </div>
      </motion.figure>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`col-span-12 md:col-span-6 ${reverse ? 'md:order-1' : 'md:col-start-7'}`}
      >
        <div className="text-[11px] tracking-[0.22em] uppercase text-silver">{eyebrow}</div>
        <blockquote
          className="mt-5 font-light tracking-tighter leading-[1.1] text-ink"
          style={{ fontSize: 'clamp(26px, 2.6vw, 38px)' }}
        >
          {quote}
        </blockquote>
        {attribution && (
          <div className="mt-7 text-[12px] tracking-[0.18em] uppercase text-silver">
            {attribution}
          </div>
        )}
      </motion.div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'
import IntakeForm from './IntakeForm'

export default function FoundersCircle() {
  const [open, setOpen] = useState(false)
  return (
    <section id="circle" className="relative overflow-hidden bg-ink px-5 py-20 text-paper md:px-[110px] md:py-40">
      <img
        src="/images/unnamed.png"
        alt="Founders Circle"
        className="absolute -left-[18px] top-1 h-16 w-24 object-contain object-left opacity-90 md:-left-[14px] md:top-4 md:h-36 md:w-36"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
      <div className="mb-12 grid w-full grid-cols-1 items-start gap-6 md:mb-16 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-start-4 md:col-span-9">
          <h2 className="font-agentic font-light tracking-tighter leading-[0.95]"
              style={{ fontSize: 'clamp(64px, 7vw, 120px)' }}>
            Founders Circle.
          </h2>
          <p className="font-luxury-readable mt-6 text-[17px] text-paper/70 max-w-[60ch]">
            A weekly meeting for <strong className="font-semibold text-paper">founders building real things</strong>.
            No theater, no spectators. Hosted by Obadiah every Sunday. Streamed and archived on
            <strong className="font-semibold text-gold"> YouTube</strong>.
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12">
        <div className="min-w-0 md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
            className="relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-2xl border border-paper/15 bg-paper/5 md:aspect-video"
          >
            <video
              src="/videos/founders-roundtable.mp4"
              className="absolute inset-0 h-full w-full object-cover object-center grayscale brightness-[0.62] contrast-110"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Founders having a roundtable conversation"
            />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="font-label text-[11px] text-paper/55">
                Founders in the room
              </div>
              <div className="mt-2 max-w-[16rem] text-[20px] leading-tight text-paper sm:max-w-[28rem] sm:text-[24px]">
                Ideas sharpen faster when builders are face to face.
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex min-w-0 flex-col justify-end gap-6 md:col-span-5">
          <Row k="When" v="Every Sunday · 6:00 PM PT" />
          <Row k="Where" v="Live on YouTube → archive" />
          <Row k="For" v="Founders · operators · builders" />
          <Row k="Cost" v="Free. Earned by doing." />
          <div className="pt-4">
            <MagneticButton
              onClick={() => setOpen(true)}
              className="shimmer-btn inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-gold hover:text-ink"
            >
              <>Request a seat <span style={{ fontVariantEmoji: 'text' }}>↗︎</span></>
            </MagneticButton>
          </div>
        </div>
      </div>

      <IntakeForm open={open} onClose={() => setOpen(false)} />
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid min-w-0 grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-paper/15 pb-4 sm:grid-cols-[110px_minmax(0,1fr)]">
      <span className="font-label text-[11px] text-gold">{k}</span>
      <span className="min-w-0 break-words text-[15px] text-paper/95">{v}</span>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MagneticButton from './MagneticButton'
import IntakeForm from './IntakeForm'

export default function FoundersCircle() {
  const [open, setOpen] = useState(false)
  return (
    <section id="circle" className="relative px-5 py-20 md:px-[110px] md:py-40 bg-ink text-paper">
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-12 md:mb-16">
        <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
          <div className="text-[11px] tracking-[0.22em] uppercase text-paper/50">Founders Circle</div>
          <img src="/images/unnamed.png" alt="Founders Circle" className="w-16 h-16 opacity-90" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-light tracking-tighter leading-[0.95]"
              style={{ fontSize: 'clamp(64px, 7vw, 120px)' }}>
            Founders Circle.
          </h2>
          <p className="mt-6 text-[17px] text-paper/70 max-w-[60ch]">
            A weekly meeting for <strong className="font-semibold text-paper">founders building real things</strong>.
            No theater, no spectators. Hosted by Obadiah every Sunday. Streamed and archived on
            <strong className="font-semibold text-paper"> YouTube</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.025 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }}
            className="relative overflow-hidden rounded-2xl border border-paper/15 aspect-video bg-paper/5"
          >
            <img
              src="/images/founders-meeting.jpg"
              alt="Founders gathered around a working table"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-ink/55" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="text-[11px] tracking-[0.22em] uppercase text-paper/55">
                Founders in the room
              </div>
              <div className="mt-2 max-w-[28rem] text-[24px] leading-tight text-paper">
                Ideas sharpen faster when builders are face to face.
              </div>
            </div>
          </motion.div>
        </div>
        <div className="col-span-12 md:col-span-5 flex flex-col gap-6 justify-end">
          <Row k="When" v="Every Sunday · 6:00 PM PT" />
          <Row k="Where" v="Live on YouTube → archive" />
          <Row k="For" v="Founders · operators · builders" />
          <Row k="Cost" v="Free. Earned by doing." />
          <div className="pt-4">
            <MagneticButton
              onClick={() => setOpen(true)}
              className="shimmer-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-paper text-ink text-[13px] font-medium"
            >
              <>Request a seat <span>↗</span></>
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
    <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-paper/15 pb-4">
      <span className="text-[11px] tracking-[0.18em] uppercase text-paper/50">{k}</span>
      <span className="text-[15px] text-paper/95">{v}</span>
    </div>
  )
}

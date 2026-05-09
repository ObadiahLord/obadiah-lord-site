'use client'

import { motion } from 'framer-motion'

export default function Hero() {

  return (
    <section id="top" className="relative w-full min-h-screen overflow-hidden">
      {/* Vertical sidebar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="hidden md:flex absolute left-9 top-0 bottom-0 z-30 items-center justify-center pointer-events-none"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="w-px h-20 bg-ink/15" />
          <span
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            className="text-[12px] tracking-wide text-silver whitespace-nowrap"
          >
            Founder · Architect · AXIS LABS
          </span>
          <span className="w-px h-20 bg-ink/15" />
        </div>
      </motion.div>

      {/* Right portrait */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 right-0 bottom-0 w-[55%] md:w-[48%] z-10 pointer-events-none"
      >
        <img
          src="/images/portrait.png"
          alt="Obadiah Lord"
          className="absolute inset-0 w-full h-full object-cover object-bottom grayscale"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, #000 44%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 22%, #000 44%)',
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 pt-[120px] md:pt-[140px] pb-20 md:pb-24 px-6 md:px-[110px] min-h-screen flex flex-col justify-end">
        {/* Name block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute top-[100px] left-6 md:top-[140px] md:left-[110px]"
        >
          <div
            className="font-light text-ink leading-none tracking-tighter"
            style={{ fontSize: 'clamp(28px, 4.6vw, 64px)' }}
          >
            Obadiah Lord
          </div>
          <div className="mt-2 text-[11px] md:text-[12px] text-silver">
            Founder and CEO, <strong className="font-semibold text-ink">AXIS LABS</strong>
          </div>
        </motion.div>

        {/* Hello + tagline */}
        <div>
          <h1
            className="font-sans font-extralight text-ink m-0 leading-[0.88] tracking-tightest"
            style={{ fontSize: 'clamp(82px, 19vw, 300px)' }}
          >
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                Hello
              </motion.span>
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mt-4 text-[15px] md:text-[16px] text-ink max-w-[26ch]"
          >
            It is Obadiah, architecting <strong className="font-semibold">Axle</strong>, your
            <strong className="font-semibold"> AI agent for Android</strong>.
          </motion.p>
        </div>
      </div>

      {/* Bottom rail */}
      <div className="hidden md:block absolute left-9 bottom-7 z-30 text-[12px] text-silver tracking-wide">2026</div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute left-6 md:left-[110px] bottom-7 z-30 text-[13px] text-ink flex items-center gap-2"
      >
        Scroll down
        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}

function Stat({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="font-light text-ink leading-none tracking-tighter"
        style={{ fontSize: 'clamp(34px, 3.4vw, 44px)' }}
      >
        {headline}
      </div>
      <div className="text-[12px] text-silver">{sub}</div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-10 lg:px-[110px] lg:py-32">
      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        <div className="col-span-12 lg:col-span-2">
          <div className="font-label text-[11px] text-gold">About</div>
        </div>

        <div className="col-span-12 lg:col-span-10 grid grid-cols-12 items-start gap-8 lg:gap-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-6 flex max-w-[42rem] flex-col gap-5"
          >
            <h2 className="font-agentic max-w-[12ch] text-[38px] font-light leading-[1.02] tracking-normal text-ink md:text-[46px] lg:text-[52px]">
              The man behind the vision.
            </h2>

            <p className="font-luxury-readable text-[17px] leading-[1.65] text-ink/80">
              Obadiah Lord Founder CEO of AXIS LABS
            </p>

            <p className="font-luxury-readable text-[14px] uppercase tracking-[0.28em] text-gold md:text-[16px]">
              Innovate . Scale . Impact
            </p>

            <div className="flex flex-col gap-4 border-t border-ink/10 pt-6 text-[17px] leading-[1.8] text-ink/76">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-12 gold-accent-line" />
                <span className="font-label text-[11px] text-gold">About Me</span>
              </div>

              <p>
                I am shaped by faith, discipline, pressure, and growth. Every season of my life taught me how to
                stay grounded, think clearly, and keep moving with purpose.
              </p>

              <p>
                <strong className="font-semibold text-ink gold-hover">Mercedes Benz</strong> taught me excellence and presence.
                <strong className="font-semibold text-ink gold-hover"> Leadpilot</strong> pushed me deeper into technology,
                where communication, automation, and execution started feeling like one language.
              </p>

              <p>
                Now that vision lives inside <strong className="font-semibold text-ink gold-hover">AXIS LABS</strong>. What I build is connected to who I
                am, and I care just as much about the person behind the work as the work itself.
              </p>

            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="col-span-12 self-start lg:sticky lg:top-28 lg:col-span-6"
          >
            <figure className="glass noise gold-outline-hover ml-auto w-full max-w-[540px] overflow-hidden rounded-[30px] border border-gold/35">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <div className="absolute inset-x-0 top-0 z-10 h-[3px] gold-accent-line" />
                <img
                  src="/images/about-obadiah-rolls.jpg"
                  alt="Obadiah Lord standing beside a luxury car"
                  className="absolute inset-0 h-full w-full object-cover object-center grayscale"
                />
              </div>
            </figure>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

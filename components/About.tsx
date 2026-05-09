'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-10 lg:px-[110px] lg:py-32">
      <div className="grid grid-cols-12 gap-8 lg:gap-10">
        <div className="col-span-12 lg:col-span-2">
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">About</div>
        </div>

        <div className="col-span-12 lg:col-span-10 grid grid-cols-12 items-start gap-8 lg:gap-10">

          {/* Left — all text stacked, constrained to not exceed photo height */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-7 flex flex-col gap-5"
          >
            <h2 className="max-w-[15ch] text-[38px] font-light leading-[1.02] tracking-normal text-ink md:text-[46px] lg:text-[52px]">
              Built from momentum.
            </h2>

            <p className="text-[17px] leading-[1.65] text-ink/80">
              I am Obadiah Lord,{' '}
              <strong className="font-semibold text-ink">founder and CEO of AXIS LABS</strong>,
              building <strong className="font-semibold text-ink">Axle</strong>, a proactive AI agent for
              Android that turns{' '}
              <strong className="font-semibold text-ink">plain English intent into action</strong>.
            </p>

            <div className="border-t border-ink/10 pt-5 flex flex-col gap-4 text-[15px] leading-[1.7] text-ink/75">
              <p>
                I started young and built an{' '}
                <strong className="font-semibold text-ink">independent dealership</strong>{' '}
                early, learning how attention, timing, and pressure turn into momentum. That
                season taught me to <strong className="font-semibold text-ink">create demand</strong>, move fast,
                and build without waiting for permission.
              </p>
              <p>
                I sharpened that instinct at{' '}
                <strong className="font-semibold text-ink">Mercedes Benz</strong>, then at{' '}
                <strong className="font-semibold text-ink">Credit Capital</strong> in high ticket B2B tech
                sales, where complex products had to become clear decisions. Those rooms trained
                my eye for intent, psychology, and high stakes execution.
              </p>
              <p>
                When AI shifted, I taught myself{' '}
                <strong className="font-semibold text-ink">full stack AI development</strong>{' '}
                to build the system I believed was missing. AXIS LABS brings that sales instinct
                and technical execution into{' '}
                <strong className="font-semibold text-ink">agents that act across software and devices</strong>{' '}
                with real purpose.
              </p>
            </div>
          </motion.div>

          {/* Right — photo, same height anchor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="col-span-12 lg:col-span-5"
          >
            <figure className="glass noise ml-auto w-full max-w-[420px] overflow-hidden rounded-[30px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
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

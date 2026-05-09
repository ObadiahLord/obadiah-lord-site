'use client'

import { motion } from 'framer-motion'

const facts = [
  {
    t: '3.9 Billion Android devices',
    d: 'Android is the most used computing platform on earth. More active devices than Windows, macOS, and iOS combined. Axle operates at that scale.',
  },
  {
    t: 'The phone never leaves your hand',
    d: 'People check their phone 96 times a day. No laptop required. No desktop session. The agent is already where the work happens.',
  },
  {
    t: 'Every app. No API needed.',
    d: 'Axle operates the UI directly — any app, any screen, any workflow. It does not wait for a developer to build an integration.',
  },
  {
    t: 'Executes while you are offline',
    d: 'Tasks queue and fire on device. The agent does not stop because you stepped away from WiFi or put the phone in your pocket.',
  },
  {
    t: 'Acts across every category',
    d: 'Banking. Travel. Messaging. Scheduling. Ordering. E-commerce. One agent that moves across the entire installed base of human software.',
  },
  {
    t: 'Real execution. Not a chatbot.',
    d: 'Axle does not answer questions. It completes tasks. It taps, reads, waits, retries, and confirms. The output is work done, not words returned.',
  },
]

export default function Axle() {
  return (
    <section id="axle" className="relative px-5 py-20 md:px-[110px] md:py-40 bg-gradient-to-b from-paper via-ink/8 to-paper">
      <div className="mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="font-light tracking-tighter leading-[0.95] text-ink"
            style={{ fontSize: 'clamp(64px, 7vw, 120px)' }}
          >
            Axle.
          </h2>
          <p className="mt-6 text-[18px] text-ink/75 max-w-[52ch] mx-auto leading-relaxed">
            The AI agent that operates your Android phone.{' '}
            <strong className="font-semibold text-ink">Give it a goal. It handles the rest.</strong>{' '}
            Here is why this is the only approach that scales to real life.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {facts.map((f, i) => (
          <motion.div
            key={f.t}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.17, delay: i * 0.06, ease: [0.2, 0.9, 0.2, 1] }}
            className="glass noise p-8 min-h-[200px] flex flex-col"
          >
            <div className="mt-auto">
              <div className="text-[19px] font-semibold text-ink tracking-tight leading-snug">{f.t}</div>
              <p className="mt-3 text-[14px] text-ink/70 leading-relaxed">{f.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

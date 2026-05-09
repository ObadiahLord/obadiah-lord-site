'use client'

import { motion } from 'framer-motion'

const services = [
  {
    n: '01',
    t: 'Founder advisory',
    d: <>For founders building <strong className="font-semibold text-ink">agentic products</strong>, AI infrastructure, or anything that has to ship to a phone. Working calls, not theater.</>,
  },
  {
    n: '02',
    t: 'AXIS partnership',
    d: <>Bring a problem worth solving on Android. <strong className="font-semibold text-ink">AXIS LABS builds the agent</strong>, the planner, and the execution surface end to end.</>,
  },
  {
    n: '03',
    t: 'Capital and warm intros',
    d: <><strong className="font-semibold text-ink">High ticket sales background</strong>, dealership operator, and an active network across automotive, fintech, and consumer tech.</>,
  },
  {
    n: '04',
    t: 'Founders Circle seat',
    d: <>Sunday session. <strong className="font-semibold text-ink">Operators only</strong>. Earned by doing, not by asking.</>,
  },
]

export default function Services() {
  return (
    <section id="services" className="relative px-[110px] py-40">
      <div className="grid grid-cols-12 gap-10 items-end mb-16">
        <div className="col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Services</div>
        </div>
        <div className="col-span-9">
          <h2
            className="font-light tracking-tighter leading-[0.95] text-ink"
            style={{ fontSize: 'clamp(56px, 6vw, 96px)' }}
          >
            How I can help.
          </h2>
          <p className="mt-6 text-[17px] text-ink/75 max-w-[60ch]">
            A short menu. Each line is something I have
            <strong className="font-semibold text-ink"> actually shipped or closed</strong>. If you do not
            see it here, ask.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.17, ease: [0.2, 0.9, 0.2, 1] }}
            className="glass p-8 noise"
          >
            <div className="flex items-center justify-end">
              <span className="text-[11px] tracking-[0.22em] text-silver">AXIS LABS</span>
            </div>
            <div className="mt-6 text-[24px] font-medium tracking-tight text-ink">{s.t}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const quotes = [
  {
    img: '/images/quote-1.jpg',
    plate: 'Plate 01',
    title: 'On the floor',
    body: <>Fourteen years selling at <strong className="font-semibold text-ink">Mercedes Benz</strong> and running Legend Auto Sales taught me how humans actually decide. That is the muscle I bring to product.</>,
  },
  {
    img: '/images/quote-2.jpg',
    plate: 'Plate 02',
    title: 'On AI agents',
    body: <>The evolution of <strong className="font-semibold text-ink">AI agents</strong> is set to redefine business and technology through intelligent automation and decision making.</>,
  },
  {
    img: '/images/quote-3.jpg',
    plate: 'Plate 03',
    title: 'On the work',
    body: <>AI agents are not just tools. They are the <strong className="font-semibold text-ink">autonomous architects of efficiency</strong>.</>,
  },
]

export default function Voice() {
  return (
    <section id="voice" className="relative px-[110px] py-40">
      <div className="grid grid-cols-12 gap-10 items-end mb-16">
        <div className="col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Voice</div>
        </div>
        <div className="col-span-9">
          <h2
            className="font-light tracking-tighter leading-[0.95] text-ink"
            style={{ fontSize: 'clamp(56px, 6vw, 96px)' }}
          >
            What I think out loud.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        {quotes.map((q, i) => (
          <motion.figure
            key={q.plate}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.17, ease: [0.2, 0.9, 0.2, 1] }}
            className={`glass overflow-hidden flex flex-col ${
              i === 0 ? 'md:translate-y-0' : i === 1 ? 'md:translate-y-10' : 'md:translate-y-20'
            }`}
          >
            <div className="relative aspect-square overflow-hidden bg-ink/5">
              <img
                src={q.img}
                alt={q.title}
                className="absolute inset-0 w-full h-full object-contain object-center grayscale"
              />
              <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] tracking-[0.22em] uppercase text-white/85 font-mono mix-blend-difference">
                <span>{q.plate}</span>
                <span>O.C.L</span>
              </div>
            </div>
            <figcaption className="p-7">
              <div className="text-[11px] tracking-[0.22em] uppercase text-silver">{q.title}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/85">{q.body}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

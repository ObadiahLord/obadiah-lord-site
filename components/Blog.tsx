'use client'

import { motion } from 'framer-motion'

const posts = [
  {
    tag: 'Essay',
    date: 'Coming soon',
    title: 'Why the phone is the missing seat for agents.',
    body: <>A note on why <strong className="font-semibold text-ink">thin client and server side intelligence</strong> is the only honest split for an Android agent that actually ships.</>,
  },
  {
    tag: 'Field note',
    date: 'Coming soon',
    title: 'What fourteen years on the floor taught me about product.',
    body: <>Selling cars at the top of the floor is the same job as building <strong className="font-semibold text-ink">intent aware software</strong>. You just hold a different clipboard.</>,
  },
  {
    tag: 'Founders Circle',
    date: 'Sundays, ongoing',
    title: 'Notes from the Sunday session.',
    body: <>Recurring drops from the <strong className="font-semibold text-ink">Founders Circle</strong>. Things builders said in the room that were too good to leave there.</>,
  },
]

export default function Blog() {
  return (
    <section id="blog" className="relative px-[110px] py-40">
      <div className="grid grid-cols-12 gap-10 items-end mb-16">
        <div className="col-span-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-silver">Blog</div>
        </div>
        <div className="col-span-9">
          <h2
            className="font-light tracking-tighter leading-[0.95] text-ink"
            style={{ fontSize: 'clamp(56px, 6vw, 96px)' }}
          >
            Writing.
          </h2>
          <p className="mt-6 text-[17px] text-ink/75 max-w-[60ch]">
            Drops on <strong className="font-semibold text-ink">what I am building</strong>, what I am
            reading, and what I am arguing about with smart people on Sunday nights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.17, ease: [0.2, 0.9, 0.2, 1] }}
            className="glass p-7 noise flex flex-col gap-4 min-h-[280px]"
          >
            <div className="flex items-center justify-between text-[11px] tracking-[0.22em] uppercase text-silver">
              <span>{p.tag}</span>
              <span>{p.date}</span>
            </div>
            <h3 className="text-[22px] leading-tight font-medium tracking-tight text-ink">
              {p.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-ink/70">{p.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

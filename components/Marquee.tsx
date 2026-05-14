'use client'

const items = ['AXIS LABS', '·', 'Axle for Android', '·', 'Founders Circle', '·', 'Sunday Sessions', '·', 'Las Vegas, NV', '·']

export default function Marquee() {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative w-full overflow-hidden border-y border-ink/10 bg-paper py-7">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 60s linear infinite', width: 'max-content' }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className={`font-agentic px-8 font-light tracking-tighter ${
              t === '·' ? 'text-gold' : 'text-ink'
            }`}
                style={{ fontSize: 'clamp(34px, 3.6vw, 56px)' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

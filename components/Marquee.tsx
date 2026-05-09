'use client'

const items = ['AXIS LABS', '·', 'Axle for Android', '·', 'Founders Circle', '·', 'Sunday Sessions', '·', 'Las Vegas, NV', '·']

export default function Marquee() {
  const row = [...items, ...items, ...items, ...items]
  return (
    <div className="relative w-full border-y border-ink/10 overflow-hidden py-7 bg-paper">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 60s linear infinite', width: 'max-content' }}
      >
        {row.map((t, i) => (
          <span key={i} className="px-8 font-light tracking-tighter text-ink"
                style={{ fontSize: 'clamp(34px, 3.6vw, 56px)' }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

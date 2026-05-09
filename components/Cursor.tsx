'use client'

import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isFinePointer, setIsFinePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setIsFinePointer(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isFinePointer) return
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    let x = -100, y = -100
    let raf = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      const t = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      ring.style.transform = t
      dot.style.transform = t
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isFinePointer])

  if (!isFinePointer) return null

  return (
    <>
      {/* Outer ring — follows with lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: 36,
          height: 36,
          border: '1.5px solid rgba(10,10,10,0.55)',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
      {/* Center dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: 5,
          height: 5,
          background: 'rgba(10,10,10,0.75)',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />
    </>
  )
}

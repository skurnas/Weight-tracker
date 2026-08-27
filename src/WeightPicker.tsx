import { useCallback, useEffect, useRef } from 'react'

const ITEM_HEIGHT = 28
const VISIBLE_COUNT = 3
const PAD = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2)

const WHOLE_VALUES = Array.from({ length: 451 }, (_, i) => i + 50) // 50-500 lbs
const TENTH_VALUES = Array.from({ length: 10 }, (_, i) => i)

function WheelColumn({
  values,
  value,
  onChange,
}: {
  values: number[]
  value: number
  onChange: (v: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<number>(undefined)

  useEffect(() => {
    const idx = values.indexOf(value)
    const el = ref.current
    if (idx < 0 || !el) return
    const target = idx * ITEM_HEIGHT
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target
  }, [value, values])

  const handleScroll = useCallback(() => {
    window.clearTimeout(scrollTimer.current)
    scrollTimer.current = window.setTimeout(() => {
      const el = ref.current
      if (!el) return
      const idx = Math.min(Math.max(Math.round(el.scrollTop / ITEM_HEIGHT), 0), values.length - 1)
      el.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' })
      const v = values[idx]
      if (v !== value) onChange(v)
    }, 120)
  }, [value, values, onChange])

  return (
    <div
      className="wheel-col"
      ref={ref}
      style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
      onScroll={handleScroll}
    >
      <div style={{ height: PAD }} />
      {values.map((v) => (
        <div
          key={v}
          className={v === value ? 'wheel-item selected' : 'wheel-item'}
          style={{ height: ITEM_HEIGHT }}
          onClick={() => onChange(v)}
        >
          {v}
        </div>
      ))}
      <div style={{ height: PAD }} />
    </div>
  )
}

export default function WeightPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const whole = Math.floor(value)
  const tenth = Math.round((value - whole) * 10)

  return (
    <div className="wheel-picker">
      <div className="wheel-highlight" />
      <WheelColumn values={WHOLE_VALUES} value={whole} onChange={(w) => onChange(w + tenth / 10)} />
      <span className="wheel-dot">.</span>
      <WheelColumn values={TENTH_VALUES} value={tenth} onChange={(t) => onChange(whole + t / 10)} />
      <span className="wheel-unit">lbs</span>
    </div>
  )
}

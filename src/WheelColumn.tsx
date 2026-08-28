import { useCallback, useEffect, useRef } from 'react'

export const DEFAULT_ITEM_HEIGHT = 28
const VISIBLE_COUNT = 3

export function WheelColumn({
  values,
  value,
  onChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
}: {
  values: number[]
  value: number
  onChange: (v: number) => void
  itemHeight?: number
}) {
  const pad = itemHeight * Math.floor(VISIBLE_COUNT / 2)
  const ref = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<number>(undefined)

  useEffect(() => {
    const idx = values.indexOf(value)
    const el = ref.current
    if (idx < 0 || !el) return
    const target = idx * itemHeight
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target
  }, [value, values, itemHeight])

  const handleScroll = useCallback(() => {
    window.clearTimeout(scrollTimer.current)
    scrollTimer.current = window.setTimeout(() => {
      const el = ref.current
      if (!el) return
      const idx = Math.min(Math.max(Math.round(el.scrollTop / itemHeight), 0), values.length - 1)
      el.scrollTo({ top: idx * itemHeight, behavior: 'smooth' })
      const v = values[idx]
      if (v !== value) onChange(v)
    }, 120)
  }, [value, values, onChange, itemHeight])

  return (
    <div
      className="wheel-col"
      ref={ref}
      style={{ height: itemHeight * VISIBLE_COUNT }}
      onScroll={handleScroll}
    >
      <div style={{ height: pad }} />
      {values.map((v) => (
        <div
          key={v}
          className={v === value ? 'wheel-item selected' : 'wheel-item'}
          style={{ height: itemHeight }}
          onClick={() => onChange(v)}
        >
          {v}
        </div>
      ))}
      <div style={{ height: pad }} />
    </div>
  )
}

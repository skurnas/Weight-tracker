import { WheelColumn } from './WheelColumn'

const ITEM_HEIGHT = 42
const WHOLE_VALUES = Array.from({ length: 451 }, (_, i) => i + 50) // 50-500 lbs
const TENTH_VALUES = Array.from({ length: 10 }, (_, i) => i)

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
    <div className="wheel-picker large">
      <div className="wheel-highlight" style={{ height: ITEM_HEIGHT }} />
      <WheelColumn
        values={WHOLE_VALUES}
        value={whole}
        itemHeight={ITEM_HEIGHT}
        onChange={(w) => onChange(w + tenth / 10)}
      />
      <span className="wheel-dot">.</span>
      <WheelColumn
        values={TENTH_VALUES}
        value={tenth}
        itemHeight={ITEM_HEIGHT}
        onChange={(t) => onChange(whole + t / 10)}
      />
      <span className="wheel-unit">lbs</span>
    </div>
  )
}

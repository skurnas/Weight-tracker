import { WheelColumn } from './WheelColumn'

const VALUES = Array.from({ length: 101 }, (_, i) => i * 5) // 0-500 lbs, step 5

export default function AddedWeightPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="wheel-picker">
      <div className="wheel-highlight" />
      <WheelColumn values={VALUES} value={value} onChange={onChange} />
      <span className="wheel-unit">lbs</span>
    </div>
  )
}

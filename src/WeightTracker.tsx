import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeightEntry } from './types'
import { useLocalStorageList } from './useLocalStorageList'
import WeightPicker from './WeightPicker'
import { parseWeightImport } from './parseWeightImport'

type RangeOption = '7' | '30' | '90' | 'all'

const RANGE_LABELS: Record<RangeOption, string> = {
  '7': '7 days',
  '30': '30 days',
  '90': '90 days',
  all: 'All time',
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function WeightTracker() {
  const { items, addItem, removeItem } = useLocalStorageList<WeightEntry>('weight-entries')
  const [weight, setWeight] = useState(150)
  const [date, setDate] = useState(todayIso())
  const [range, setRange] = useState<RangeOption>('30')
  const [importText, setImportText] = useState('')
  const [importResult, setImportResult] = useState<{ count: number; skipped: number } | null>(null)

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.date.localeCompare(b.date)),
    [items],
  )

  const filtered = useMemo(() => {
    if (range === 'all') return sorted
    const days = Number(range)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffIso = cutoff.toISOString().slice(0, 10)
    return sorted.filter((entry) => entry.date >= cutoffIso)
  }, [sorted, range])

  const chartData = filtered.map((entry) => ({
    date: entry.date,
    weight: entry.weightLbs,
  }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    addItem({ id: crypto.randomUUID(), date, weightLbs: weight })
  }

  function handleImport() {
    const { entries, skipped } = parseWeightImport(importText)
    for (const entry of entries) addItem(entry)
    setImportResult({ count: entries.length, skipped })
    setImportText('')
  }

  return (
    <div className="panel">
      <h2>Weight</h2>

      <form className="quick-form" onSubmit={handleSubmit}>
        <WeightPicker value={weight} onChange={setWeight} />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Log weight</button>
      </form>

      <div className="range-selector">
        {(Object.keys(RANGE_LABELS) as RangeOption[]).map((option) => (
          <button
            key={option}
            type="button"
            className={option === range ? 'range-btn active' : 'range-btn'}
            onClick={() => setRange(option)}
          >
            {RANGE_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="chart-wrap">
        {chartData.length === 0 ? (
          <p className="empty">No weight entries in this range yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} unit=" lbs" width={60} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {sorted.length > 0 && (
        <details className="history">
          <summary>History ({sorted.length})</summary>
          <ul>
            {[...sorted].reverse().map((entry) => (
              <li key={entry.id}>
                <span>{entry.date}</span>
                <span>{entry.weightLbs} lbs</span>
                <button type="button" className="remove-btn" onClick={() => removeItem(entry.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <details className="import">
        <summary>Import history</summary>
        <p className="import-hint">
          Paste one entry per line as <code>date, weight</code> — e.g. <code>2026-01-15, 182.4</code>.
          Dates can be YYYY-MM-DD or M/D/YYYY, separated by a comma or tab (so pasting straight from a
          spreadsheet works too).
        </p>
        <textarea
          className="import-textarea"
          rows={6}
          placeholder={'2026-01-15, 182.4\n2026-01-20, 181.0'}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <button type="button" onClick={handleImport} disabled={!importText.trim()}>
          Import
        </button>
        {importResult && (
          <p className="import-result">
            Imported {importResult.count} {importResult.count === 1 ? 'entry' : 'entries'}
            {importResult.skipped > 0
              ? `, skipped ${importResult.skipped} line${importResult.skipped === 1 ? '' : 's'} that couldn't be parsed`
              : ''}
            .
          </p>
        )}
      </details>
    </div>
  )
}

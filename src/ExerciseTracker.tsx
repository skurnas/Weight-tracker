import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ExerciseSet } from './types'
import { COMMON_EXERCISES } from './types'
import { useLocalStorageList } from './useLocalStorageList'
import AddedWeightPicker from './AddedWeightPicker'

const REP_INCREMENTS = [1, 5, 10] as const
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

export default function ExerciseTracker() {
  const { items, addItem, removeItem } = useLocalStorageList<ExerciseSet>('exercise-sets')
  const [exerciseName, setExerciseName] = useState<string>(COMMON_EXERCISES[0])
  const [reps, setReps] = useState(0)
  const [addedWeight, setAddedWeight] = useState(0)
  const [date, setDate] = useState(todayIso())
  const [range, setRange] = useState<RangeOption>('30')

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  )

  const chartData = useMemo(() => {
    let scoped = items.filter((entry) => entry.exerciseName === exerciseName)
    if (range !== 'all') {
      const days = Number(range)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      const cutoffIso = cutoff.toISOString().slice(0, 10)
      scoped = scoped.filter((entry) => entry.date >= cutoffIso)
    }
    const byDate = new Map<string, number>()
    for (const entry of scoped) {
      byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.reps)
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([entryDate, reps]) => ({ date: entryDate, reps }))
  }, [items, exerciseName, range])

  function selectExercise(name: string) {
    setExerciseName(name)
    setReps(0)
  }

  function handleLog() {
    if (reps <= 0) return
    addItem({
      id: crypto.randomUUID(),
      date,
      exerciseName,
      reps,
      addedWeightLbs: addedWeight,
    })
    setReps(0)
    setAddedWeight(0)
  }

  return (
    <div className="panel">
      <h2>Exercise</h2>

      <div className="exercise-menu">
        {COMMON_EXERCISES.map((name) => (
          <button
            key={name}
            type="button"
            className={name === exerciseName ? 'exercise-btn active' : 'exercise-btn'}
            onClick={() => selectExercise(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="quick-form">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="rep-row">
        <span className="rep-count">{reps} reps</span>
        <div className="rep-buttons">
          {REP_INCREMENTS.map((inc) => (
            <button key={inc} type="button" onClick={() => setReps((r) => r + inc)}>
              +{inc}
            </button>
          ))}
          <button type="button" className="reset-btn" onClick={() => setReps(0)}>
            Reset
          </button>
        </div>
      </div>

      <div className="weight-row">
        <div className="field">
          <span className="field-label">Added weight</span>
          <AddedWeightPicker value={addedWeight} onChange={setAddedWeight} />
        </div>
        <button type="button" className="log-btn" onClick={handleLog} disabled={reps <= 0}>
          Log set
        </button>
      </div>

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
          <p className="empty">No {exerciseName} sets in this range yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} unit=" reps" width={60} />
              <Tooltip />
              <Bar dataKey="reps" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {sorted.length > 0 && (
        <details className="history" open>
          <summary>History ({sorted.length})</summary>
          <ul>
            {sorted.map((entry) => (
              <li key={entry.id}>
                <span>{entry.date}</span>
                <span>{entry.exerciseName}</span>
                <span>
                  {entry.reps} reps{entry.addedWeightLbs > 0 ? ` @ ${entry.addedWeightLbs} lbs` : ''}
                </span>
                <button type="button" className="remove-btn" onClick={() => removeItem(entry.id)}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

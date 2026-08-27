import { useMemo, useState } from 'react'
import type { ExerciseSet } from './types'
import { COMMON_EXERCISES } from './types'
import { useLocalStorageList } from './useLocalStorageList'

const REP_INCREMENTS = [1, 5, 10] as const

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function ExerciseTracker() {
  const { items, addItem, removeItem } = useLocalStorageList<ExerciseSet>('exercise-sets')
  const [exerciseName, setExerciseName] = useState<string>(COMMON_EXERCISES[0])
  const [customExercise, setCustomExercise] = useState('')
  const [reps, setReps] = useState(0)
  const [addedWeight, setAddedWeight] = useState('')
  const [date, setDate] = useState(todayIso())

  const effectiveName = exerciseName === '__custom__' ? customExercise.trim() : exerciseName

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  )

  function handleLog() {
    if (!effectiveName || reps <= 0) return
    addItem({
      id: crypto.randomUUID(),
      date,
      exerciseName: effectiveName,
      reps,
      addedWeightLbs: Number(addedWeight) || 0,
    })
    setReps(0)
    setAddedWeight('')
  }

  return (
    <div className="panel">
      <h2>Exercise</h2>

      <div className="quick-form exercise-form">
        <select value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}>
          {COMMON_EXERCISES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__custom__">Custom…</option>
        </select>
        {exerciseName === '__custom__' && (
          <input
            type="text"
            placeholder="Exercise name"
            value={customExercise}
            onChange={(e) => setCustomExercise(e.target.value)}
          />
        )}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
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
        <label>
          Added weight (lbs)
          <input
            type="number"
            inputMode="decimal"
            step="0.5"
            placeholder="0"
            value={addedWeight}
            onChange={(e) => setAddedWeight(e.target.value)}
          />
        </label>
        <button type="button" className="log-btn" onClick={handleLog} disabled={!effectiveName || reps <= 0}>
          Log set
        </button>
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

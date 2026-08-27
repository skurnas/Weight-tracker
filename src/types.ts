export interface WeightEntry {
  id: string
  date: string // ISO date, yyyy-mm-dd
  weightLbs: number
}

export interface ExerciseSet {
  id: string
  date: string // ISO date, yyyy-mm-dd
  exerciseName: string
  reps: number
  addedWeightLbs: number
}

export const COMMON_EXERCISES = [
  'Bench Press',
  'Squat',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
  'Pull-up',
  'Push-up',
  'Bicep Curl',
  'Tricep Extension',
  'Lat Pulldown',
] as const

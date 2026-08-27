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

export const COMMON_EXERCISES = ['Push-up', 'Pull-up', 'Plank', 'Squat'] as const

export type DBExercise = {
  id: string
  name: string
  primary_muscle: string
  equipment: string
  difficulty: string
}

export type BuilderExercise = {
  id: string // A unique ID for the dragged instance (crypto.randomUUID)
  exercise_id: string // The actual exercise DB ID (or null if predefined/custom text only for now, wait we should map predefined to DB exercises eventually, but for now we can just store the name or fetch by name)
  name: string
  primary_muscle: string
  target_sets: number
  target_reps: number
  target_weight_kg: number
  rest_seconds: number
}

export type BuilderRoutine = {
  id: string
  name: string
  exercises: BuilderExercise[]
}

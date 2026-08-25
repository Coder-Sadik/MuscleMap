'use client'

import { useRouter } from 'next/navigation'
import { Play, Dumbbell } from 'lucide-react'
import { ACTIVE_WORKOUT_KEY } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Routine = {
  id: string
  name: string
  exercises: {
    exercise_id: string
    name: string
    target_sets: number
    target_reps: number
    target_weight_kg: number
  }[]
}

export function StartRoutineButton({ routine }: { routine: Routine }) {
  const router = useRouter()
  const { dict } = useLanguage()

  function handleStart() {
    const exercises = routine.exercises.map(ex => ({
      exercise_id: ex.exercise_id,
      name: ex.name,
      sets: Array.from({ length: ex.target_sets || 3 }).map(() => ({
        id: window.crypto.randomUUID(),
        weight: ex.target_weight_kg ? ex.target_weight_kg.toString() : '',
        reps: ex.target_reps ? ex.target_reps.toString() : '',
        completed: false,
      })),
    }))

    localStorage.setItem(
      ACTIVE_WORKOUT_KEY,
      JSON.stringify({ startTime: Date.now(), exercises })
    )
    router.push('/workout/active')
  }

  return (
    <button
      onClick={handleStart}
      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold px-5 py-2.5 rounded-2xl text-sm transition-all shadow-[0_0_20px_-6px_rgba(16,185,129,0.7)]"
    >
      <Play className="w-4 h-4 fill-black" />
      {dict.home.startWorkout}
    </button>
  )
}

export function StartEmptyButton() {
  const router = useRouter()
  const { dict } = useLanguage()

  function handleStart() {
    localStorage.removeItem(ACTIVE_WORKOUT_KEY)
    router.push('/workout/active')
  }

  return (
    <button
      onClick={handleStart}
      className="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    >
      <Dumbbell className="w-6 h-6" />
      {dict.home.startEmptyWorkout}
    </button>
  )
}

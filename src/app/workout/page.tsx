'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ClipboardList, Play, Dumbbell, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { ACTIVE_WORKOUT_KEY } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { toast } from 'sonner'

type Routine = {
  id: string
  name: string
  routine_exercises: {
    exercise_id: string
    target_sets: number
    target_reps: number
    target_weight_kg: number
    exercises: {
      name: string
      primary_muscle: string
    }
  }[]
}

// B18 fix: constant is now imported from @/lib/constants

export default function WorkoutHub() {
  // B11 fix: stabilise supabase client with useRef
  const supabase = useRef(createClient()).current
  const router = useRouter()
  const { dict, language } = useLanguage()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRoutines = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('workout_routines')
      .select(`
        id,
        name,
        routine_exercises (
          exercise_id,
          target_sets,
          target_reps,
          target_weight_kg,
          exercises (
            name,
            primary_muscle
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching routines:', error)
    } else {
      setRoutines(data as unknown as Routine[])
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchRoutines()
  }, [fetchRoutines])

  const handleDeleteRoutine = async (routineId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(dict.workout.deleteRoutine + '?')) {
      setRoutines(prev => prev.filter(r => r.id !== routineId))
      try {
        await supabase.from('workout_routines').delete().eq('id', routineId)
        toast.success(language === 'bn' ? 'রুটিন মুছে ফেলা হয়েছে' : 'Routine deleted')
      } catch (err) {
        console.error('Error deleting routine:', err)
        fetchRoutines()
      }
    }
  }

  const handleStartRoutine = (routine: Routine) => {
    // Map routine_exercises to the format expected by ActiveWorkout
    const exercises = routine.routine_exercises.map(re => {
      const sets = Array.from({ length: re.target_sets || 3 }).map(() => ({
        id: window.crypto.randomUUID(),
        weight: re.target_weight_kg ? re.target_weight_kg.toString() : '',
        reps: re.target_reps ? re.target_reps.toString() : '',
        completed: false
      }))

      return {
        exercise_id: re.exercise_id,
        name: re.exercises?.name || 'Unknown Exercise',
        sets
      }
    })

    // Save to local storage
    localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify({
      // eslint-disable-next-line react-hooks/purity
      startTime: Date.now(),
      isRunning: true,
      exercises
    }))

    // Navigate to active workout
    router.push('/workout/active')
  }

  return (
    <div className="flex flex-col min-h-screen bg-black p-6 pt-12 pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      <header className="space-y-1 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{dict.workout.title}</h1>
        <p className="text-zinc-400 text-sm">{dict.workout.subtitle}</p>
      </header>

      {/* Quick Start */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
        <h2 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-4">{dict.workout.quickStart}</h2>
        {/* B23 fix: removed localStorage.removeItem from onClick.
            ActiveWorkout reads the key on mount and starts fresh if it doesn't exist.
            Clearing it here causes data loss if navigation fails mid-click. */}
        <Link href="/workout/active" className="block">
          <Button className="w-full h-20 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] transition-all group">
            <Plus className="w-7 h-7 mr-2 group-hover:scale-110 transition-transform" />
            {dict.workout.startEmpty}
          </Button>
        </Link>
      </section>

      {/* My Routines */}
      <section className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">{dict.workout.myRoutines}</h2>
          <Link href="/workout/builder" passHref>
            <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 h-8 px-2 text-xs">
              <Plus className="w-4 h-4 mr-1" /> {dict.workout.newRoutine}
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center p-8 text-zinc-500">{dict.common.loading}</div>
          ) : routines.length === 0 ? (
            <Card className="bg-zinc-950/50 backdrop-blur-md border-white/5 border-dashed flex flex-col items-center justify-center p-8 text-center">
              <ClipboardList className="w-8 h-8 text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400 font-medium">{dict.workout.noRoutines}</p>
              <p className="text-xs text-zinc-600 mt-1">{dict.workout.noRoutinesSub}</p>
            </Card>
          ) : (
            routines.map(routine => (
              <Card key={routine.id} className="bg-zinc-950/50 backdrop-blur-md border-white/10 overflow-hidden group">
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-lg">{routine.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        {routine.routine_exercises.length} {dict.workout.exercisesCount}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteRoutine(routine.id, e)}
                        className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 rounded-xl transition-colors"
                        title={dict.workout.deleteRoutine}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleStartRoutine(routine)}
                        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors font-bold"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {dict.home.startWorkout}
                      </Button>
                    </div>
                  </div>

                  
                  {/* Preview exercises */}
                  <div className="flex flex-wrap gap-2">
                    {routine.routine_exercises.slice(0, 3).map((re, idx) => (
                      <div key={idx} className="flex items-center text-xs bg-zinc-900 text-zinc-300 px-2 py-1 rounded-md">
                        <Dumbbell className="w-3 h-3 mr-1 text-emerald-500/70" />
                        {re.exercises?.name || 'Unknown'}
                      </div>
                    ))}
                    {routine.routine_exercises.length > 3 && (
                      <div className="flex items-center text-xs bg-zinc-900 text-zinc-500 px-2 py-1 rounded-md">
                        +{routine.routine_exercises.length - 3} {dict.home.more}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

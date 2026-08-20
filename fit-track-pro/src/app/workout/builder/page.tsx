'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { PREDEFINED_PLANS, PredefinedPlan } from './predefinedPlans'
import { BuilderRoutine } from './types'
import RoutineEditor from './RoutineEditor'
import Link from 'next/link'

export default function BuilderPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [step, setStep] = useState<1 | 2>(1)
  const [routines, setRoutines] = useState<BuilderRoutine[]>([])
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const handleSelectPlan = async (plan: PredefinedPlan) => {
    // We need to resolve exercise names to actual DB exercise IDs where possible
    // For a real app, you might want to fetch all exercises and map them by name
    const { data: dbExercises } = await supabase.from('exercises').select('id, name')
    const exerciseMap = new Map((dbExercises || []).map(ex => [ex.name.toLowerCase(), ex.id]))

    const newRoutines: BuilderRoutine[] = plan.routines.map((rt) => ({
      id: window.crypto.randomUUID(),
      name: rt.name,
      exercises: rt.exercises.map(ex => ({
        id: window.crypto.randomUUID(),
        exercise_id: exerciseMap.get(ex.name.toLowerCase()) || '',
        name: ex.name,
        primary_muscle: ex.primary_muscle,
        target_sets: ex.target_sets,
        target_reps: ex.target_reps,
        target_weight_kg: 0,
        rest_seconds: ex.rest_seconds
      }))
    }))

    setRoutines(newRoutines)
    setStep(2)
  }

  const handleCreateCustom = (days: number) => {
    const newRoutines: BuilderRoutine[] = Array.from({ length: days }).map((_, i) => ({
      id: window.crypto.randomUUID(),
      name: `Day ${i + 1}`,
      exercises: []
    }))
    setRoutines(newRoutines)
    setStep(2)
  }

  const handleSave = async () => {
    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('You must be logged in to save routines.')
      setIsSaving(false)
      return
    }

    try {
      for (const routine of routines) {
        if (routine.exercises.length === 0) continue // Skip empty routines

        // 1. Insert Routine
        const { data: routineData, error: routineError } = await supabase
          .from('workout_routines')
          .insert({
            user_id: user.id,
            name: routine.name,
            notes: 'Created via Weekly Builder'
          })
          .select()
          .single()

        if (routineError) throw routineError

        // 2. Insert Exercises
        const exercisesToInsert = routine.exercises.map((ex, index) => ({
          routine_id: routineData.id,
          exercise_id: ex.exercise_id || null, // Might be null if predefined didn't match DB
          order_index: index,
          target_sets: ex.target_sets,
          target_reps: ex.target_reps,
          rest_seconds: ex.rest_seconds,
          target_weight_kg: ex.target_weight_kg || null
        })).filter(ex => ex.exercise_id !== null)

        if (exercisesToInsert.length > 0) {
          const { error: exercisesError } = await supabase
            .from('routine_exercises')
            .insert(exercisesToInsert)

          if (exercisesError) throw exercisesError
        }
      }
      
      router.push('/workout')
    } catch (e) {
      console.error("Error saving routines", e)
      alert("There was an error saving your routines.")
    } finally {
      setIsSaving(false)
    }
  }

  if (step === 1) {
    return (
      <div className="flex flex-col min-h-screen bg-black pb-32">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-4">
          <Link href="/workout" className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-white">Routine Builder</h1>
        </header>

        <main className="p-4 space-y-8 animate-in fade-in duration-500">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 mb-4">Predefined Templates</h2>
            <div className="space-y-3">
              {PREDEFINED_PLANS.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1">{plan.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-emerald-400 mb-4">Custom Split</h2>
            <div className="grid grid-cols-3 gap-3">
              {[3, 4, 5].map(days => (
                <button
                  key={days}
                  onClick={() => handleCreateCustom(days)}
                  className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all active:scale-95"
                >
                  <span className="text-3xl font-black text-white">{days}</span>
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Days</span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Edit Split</h1>
        </div>
        
        {/* Day Navigator */}
        <div className="flex items-center justify-between bg-zinc-900/50 rounded-full p-1 border border-white/5">
          <button 
            onClick={() => setCurrentDayIndex(i => Math.max(0, i - 1))}
            disabled={currentDayIndex === 0}
            className="p-2 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {routines.map((rt, i) => (
              <button
                key={rt.id}
                onClick={() => setCurrentDayIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentDayIndex === i ? 'bg-emerald-500 scale-125' : 'bg-zinc-700 hover:bg-zinc-600'}`}
              />
            ))}
          </div>

          <button 
            onClick={() => setCurrentDayIndex(i => Math.min(routines.length - 1, i + 1))}
            disabled={currentDayIndex === routines.length - 1}
            className="p-2 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 animate-in slide-in-from-right-4 duration-300">
        <RoutineEditor 
          routine={routines[currentDayIndex]}
          onRoutineChange={(updated) => {
            const newRoutines = [...routines]
            newRoutines[currentDayIndex] = updated
            setRoutines(newRoutines)
          }}
        />
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-40 pb-safe">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all active:scale-95"
        >
          {isSaving ? "Saving..." : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Routines
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

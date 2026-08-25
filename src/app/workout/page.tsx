'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ClipboardList, Play, Dumbbell, Trash2, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { ACTIVE_WORKOUT_KEY } from '@/lib/constants'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { toast } from 'sonner'
import ExerciseProcedureModal, { ExerciseDetailData } from '@/components/ExerciseProcedureModal'
import ConfirmModal from '@/components/ConfirmModal'


type RoutineExercise = {
  exercise_id: string
  target_sets: number
  target_reps: number
  target_weight_kg: number
  exercises: {
    id?: string
    name: string
    primary_muscle: string
    secondary_muscles?: string[] | null
    equipment?: string
    difficulty?: string
    instructions?: string[] | null
    common_mistakes?: string[] | null
    safety_cautions?: string[] | null
    rest_recommendation?: string | null
  } | null
}

type Routine = {
  id: string
  name: string
  routine_exercises: RoutineExercise[]
}

export default function WorkoutHub() {
  const supabase = useRef(createClient()).current
  const router = useRouter()
  const { dict, language } = useLanguage()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedRoutineIds, setExpandedRoutineIds] = useState<Set<string>>(new Set())
  const [selectedExerciseForDetails, setSelectedExerciseForDetails] = useState<ExerciseDetailData | null>(null)
  const [routineToDelete, setRoutineToDelete] = useState<{ id: string; name: string } | null>(null)


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
            id,
            name,
            primary_muscle,
            secondary_muscles,
            equipment,
            difficulty,
            instructions,
            common_mistakes,
            safety_cautions,
            rest_recommendation
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

  const toggleExpand = (routineId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setExpandedRoutineIds(prev => {
      const next = new Set(prev)
      if (next.has(routineId)) {
        next.delete(routineId)
      } else {
        next.add(routineId)
      }
      return next
    })
  }

  const handleDeleteRoutine = (routine: Routine, e: React.MouseEvent) => {
    e.stopPropagation()
    setRoutineToDelete({ id: routine.id, name: routine.name })
  }

  const handleConfirmDeleteRoutine = async () => {
    if (!routineToDelete) return
    const routineId = routineToDelete.id
    setRoutines(prev => prev.filter(r => r.id !== routineId))
    try {
      await supabase.from('workout_routines').delete().eq('id', routineId)
      toast.success(language === 'bn' ? 'রুটিন মুছে ফেলা হয়েছে' : 'Routine deleted')
    } catch (err) {
      console.error('Error deleting routine:', err)
      fetchRoutines()
    } finally {
      setRoutineToDelete(null)
    }
  }


  const handleStartRoutine = (routine: Routine, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
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

    localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify({
      startTime: Date.now(),
      isRunning: true,
      exercises
    }))

    router.push('/workout/active')
  }

  const handleOpenExerciseDetails = (exercise: RoutineExercise['exercises'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!exercise) return
    setSelectedExerciseForDetails({
      id: exercise.id,
      name: exercise.name,
      primary_muscle: exercise.primary_muscle,
      secondary_muscles: exercise.secondary_muscles,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      common_mistakes: exercise.common_mistakes,
      safety_cautions: exercise.safety_cautions,
      rest_recommendation: exercise.rest_recommendation,
    })
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
        <Link href="/workout/active" className="block">
          <Button className="w-full h-20 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] transition-all group cursor-pointer">
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
            <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 h-8 px-2 text-xs cursor-pointer">
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
            routines.map(routine => {
              const isExpanded = expandedRoutineIds.has(routine.id)

              return (
                <Card 
                  key={routine.id} 
                  className="bg-zinc-950/60 backdrop-blur-md border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/20"
                >
                  <div className="p-4 flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div 
                        onClick={() => toggleExpand(routine.id)}
                        className="cursor-pointer group/title flex items-start gap-2 select-none"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-lg group-hover/title:text-emerald-400 transition-colors">
                              {routine.name}
                            </h3>
                            <button
                              type="button"
                              onClick={(e) => toggleExpand(routine.id, e)}
                              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                              aria-label={isExpanded ? dict.workout.tapToCollapse : dict.workout.tapToExpand}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-zinc-500" />
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                            <span>{routine.routine_exercises.length} {dict.workout.exercisesCount}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-emerald-500/80 font-medium">
                              {isExpanded ? dict.workout.tapToCollapse : dict.workout.tapToExpand}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteRoutine(routine, e)}
                          className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-9 w-9 rounded-xl transition-colors cursor-pointer"
                          title={dict.workout.deleteRoutine}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <Button 
                          onClick={(e) => handleStartRoutine(routine, e)}
                          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors font-bold cursor-pointer"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {dict.home.startWorkout}
                        </Button>
                      </div>
                    </div>

                    {/* Preview exercises (Collapsed State) */}
                    {!isExpanded && (
                      <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in duration-200">
                        {routine.routine_exercises.slice(0, 3).map((re, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={(e) => handleOpenExerciseDetails(re.exercises, e)}
                            className="flex items-center text-xs bg-zinc-900 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-300 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group/chip"
                            title={dict.workout.viewExerciseDetails}
                          >
                            <Dumbbell className="w-3 h-3 mr-1.5 text-emerald-500/70 group-hover/chip:text-emerald-400" />
                            <span>{re.exercises?.name || 'Unknown'}</span>
                            <Info className="w-3 h-3 ml-1.5 opacity-40 group-hover/chip:opacity-100 text-emerald-400" />
                          </button>
                        ))}
                        {routine.routine_exercises.length > 3 && (
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(routine.id, e)}
                            className="flex items-center text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer font-medium"
                          >
                            +{routine.routine_exercises.length - 3} {dict.home.more}
                            <ChevronDown className="w-3 h-3 ml-1 text-zinc-500" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Full Expanded Exercise List */}
                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between px-1">
                          <span>{language === 'bn' ? 'সকল ব্যায়ামের তালিকা' : 'Routine Exercises'}</span>
                          <span className="text-zinc-600 text-[10px] lowercase">{language === 'bn' ? 'নিয়ম দেখতে ট্যাপ করুন' : 'tap for rules & steps'}</span>
                        </div>

                        <div className="space-y-2">
                          {routine.routine_exercises.map((re, idx) => (
                            <div
                              key={idx}
                              onClick={(e) => handleOpenExerciseDetails(re.exercises, e)}
                              className="p-3 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 transition-all cursor-pointer group/row"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black flex items-center justify-center shrink-0 border border-emerald-500/20">
                                  {idx + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white group-hover/row:text-emerald-300 transition-colors truncate">
                                      {re.exercises?.name || 'Unknown'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                    <span className="text-emerald-400/90 font-medium text-[11px]">
                                      {re.exercises?.primary_muscle}
                                    </span>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-zinc-400 text-[11px]">
                                      {re.target_sets || 3} {dict.workout.set}s × {re.target_reps || 10} {dict.workout.reps}
                                      {re.target_weight_kg ? ` @ ${re.target_weight_kg}kg` : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleOpenExerciseDetails(re.exercises, e)}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800 group-hover/row:bg-emerald-500/20 text-zinc-400 group-hover/row:text-emerald-300 text-xs font-semibold flex items-center gap-1 shrink-0 border border-white/5 transition-all"
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{dict.workout.viewExerciseDetails}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Collapse Bar */}
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(routine.id, e)}
                            className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                            {dict.workout.tapToCollapse}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </section>

      {/* Exercise Procedure & Rules Modal */}
      <ExerciseProcedureModal 
        exercise={selectedExerciseForDetails}
        onClose={() => setSelectedExerciseForDetails(null)}
      />

      {/* Delete Routine Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(routineToDelete)}
        onClose={() => setRoutineToDelete(null)}
        onConfirm={handleConfirmDeleteRoutine}
        title={language === 'bn' ? 'রুটিন মুছে ফেলবেন?' : 'Delete Routine?'}
        description={
          language === 'bn'
            ? `আপনি কি নিশ্চিত যে "${routineToDelete?.name || ''}" রুটিনটি মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।`
            : `Are you sure you want to delete "${routineToDelete?.name || ''}"? This custom routine will be permanently removed.`
        }
        confirmText={dict.workout.deleteRoutine}
        cancelText={language === 'bn' ? 'বাতিল' : 'Cancel'}
        variant="danger"
        icon="trash"
      />
    </div>
  )
}



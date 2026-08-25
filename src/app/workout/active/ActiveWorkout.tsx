'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Check, Plus, Search, Dumbbell, Timer, Play, Pause, ChevronRight, ChevronLeft, SkipForward, Minus, Trash2, X } from 'lucide-react'

import { ACTIVE_WORKOUT_KEY } from '@/lib/constants'
import { formatTime } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import ConfirmModal from '@/components/ConfirmModal'


// Types
type SetData = {
  id: string
  weight: string
  reps: string
  completed: boolean
}

type WorkoutExercise = {
  exercise_id: string
  name: string
  sets: SetData[]
}

type DBExercise = {
  id: string
  name: string
  primary_muscle: string
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────

function WorkoutSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-black pb-6 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="h-7 w-20 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="h-9 w-20 bg-zinc-800 rounded-xl animate-pulse" />
      </header>
      <main className="flex-1 flex flex-col pt-6 px-4 gap-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-zinc-800 rounded-full animate-pulse" />
          <div className="flex flex-col items-center gap-3 flex-1 px-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl animate-pulse" />
            <div className="h-7 w-48 bg-zinc-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-zinc-800 rounded-full animate-pulse" />
        </div>
        <div className="mt-auto">
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 space-y-6">
            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-zinc-800 rounded-2xl animate-pulse" />
              <div className="h-20 bg-zinc-800 rounded-2xl animate-pulse" />
            </div>
            <div className="h-16 bg-zinc-800 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActiveWorkout() {
  const router = useRouter()
  const { dict, language } = useLanguage()
  // B14: stabilise the supabase client — createClient() is cheap but
  // using a ref prevents accidental dep-array churn in effects.
  const supabase = useRef(createClient()).current
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const activeLogIdRef = useRef<string | null>(null)
  // B3: use a state counter to trigger a new rest timer effect on each new rest period.
  // Using state (not a ref) means React can safely track it in the deps array.

  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])

  // Gym Mode State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null)
  const [restTimerTrigger, setRestTimerTrigger] = useState(0)
  const [previousStats, setPreviousStats] = useState<Record<string, string>>({})
  const [previousVolumes, setPreviousVolumes] = useState<Record<string, number>>({})
  const [personalRecords, setPersonalRecords] = useState<Record<string, number>>({})

  // Selector State
  const [isSelecting, setIsSelecting] = useState(false)
  const [dbExercises, setDbExercises] = useState<DBExercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false)


  // ── Load from LocalStorage on mount & Fetch Previous Stats ───────────────

  useEffect(() => {
    const initializeWorkout = async () => {
      const saved = localStorage.getItem(ACTIVE_WORKOUT_KEY)
      let initialExercises: WorkoutExercise[] = []
      let loadedStartTime: number | null = null
      let loadedElapsed = 0
      let loadedIsRunning = false

      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed.exercises) && parsed.exercises.length > 0) {
            initialExercises = parsed.exercises
            loadedStartTime = parsed.startTime || null
            loadedElapsed = typeof parsed.elapsedSeconds === 'number' ? parsed.elapsedSeconds : 0
            loadedIsRunning = !!parsed.isRunning
            if (loadedIsRunning && loadedStartTime) {
              const delta = Math.max(0, Math.floor((Date.now() - loadedStartTime) / 1000))
              loadedElapsed += delta
            }
          }
        } catch (e) {
          console.error('Failed to parse saved workout', e)
        }
      }

      setStartTime(loadedIsRunning ? Date.now() : loadedStartTime)
      setElapsedSeconds(loadedElapsed)
      setIsRunning(loadedIsRunning)

      // P1: limit to 20 most recent logs (was 100) — PRs are an approximation
      // and 20 logs is far more than enough for autofill; this cuts the payload ~80%.
      const { data: { user } } = await supabase.auth.getUser()
      if (user && initialExercises.length > 0) {
        const { data } = await supabase
          .from('workout_logs')
          .select('exercises_data')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(20)

        const pastStats: Record<string, { weight: string; reps: string }> = {}
        const pastStrings: Record<string, string> = {}
        const prevVols: Record<string, number> = {}
        const prVols: Record<string, number> = {}

        if (data) {
          for (const log of data) {
            const pastExercises = log.exercises_data as WorkoutExercise[]
            if (Array.isArray(pastExercises)) {
              for (const pEx of pastExercises) {
                let logVolume = 0
                let hasCompletedSets = false
                if (pEx.sets) {
                  for (const s of pEx.sets) {
                    if (s.completed) {
                      const w = parseFloat(s.weight) || 0
                      const r = parseFloat(s.reps) || 0
                      logVolume += w * r
                      hasCompletedSets = true
                    }
                  }
                }

                if (hasCompletedSets) {
                  if (!prVols[pEx.exercise_id] || logVolume > prVols[pEx.exercise_id]) {
                    prVols[pEx.exercise_id] = logVolume
                  }
                }

                if (!pastStats[pEx.exercise_id] && pEx.sets && pEx.sets.length > 0) {
                  const validSet = pEx.sets.find(s => s.completed && s.weight && s.reps) || pEx.sets[0]
                  if (validSet) {
                    pastStats[pEx.exercise_id] = { weight: validSet.weight, reps: validSet.reps }
                    pastStrings[pEx.exercise_id] = `${pEx.sets.length} sets × ${validSet.reps} @ ${validSet.weight}kg`
                    if (hasCompletedSets) prevVols[pEx.exercise_id] = logVolume
                  }
                }
              }
            }
          }
        }

        setPreviousStats(pastStrings)
        setPreviousVolumes(prevVols)
        setPersonalRecords(prVols)

        // Apply autofill
        initialExercises = initialExercises.map(ex => {
          const stats = pastStats[ex.exercise_id]
          return {
            ...ex,
            sets: ex.sets.map(s => ({
              ...s,
              weight: s.weight || (stats ? stats.weight : '20'),
              reps: s.reps || (stats ? stats.reps : '10'),
            })),
          }
        })
      }

      setExercises(initialExercises)
      setIsLoaded(true)
    }

    initializeWorkout()
    // supabase is a stable ref — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-save to LocalStorage ─────────────────────────────────────────────

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        ACTIVE_WORKOUT_KEY,
        JSON.stringify({
          startTime: isRunning ? Date.now() : startTime,
          elapsedSeconds,
          isRunning,
          exercises,
        })
      )
    }
  }, [exercises, startTime, elapsedSeconds, isRunning, isLoaded])

  // ── Workout Duration Timer ────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded || !isRunning) {
      if (timerInterval.current) clearInterval(timerInterval.current)
      return
    }

    timerInterval.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current)
    }
  }, [isRunning, isLoaded])

  const toggleTimer = () => {
    setIsRunning(prev => {
      const next = !prev
      if (next && !startTime) {
        setStartTime(Date.now())
      }
      return next
    })
  }



  // ── Rest Timer ────────────────────────────────────────────────────────────
  // B3 fix: the effect is keyed to `restTimerTrigger`, a counter that only
  // increments when a new rest period starts. This means exactly ONE interval
  // is created per rest period, not one on every countdown tick.

  useEffect(() => {
    if (restSecondsRemaining === null) return

    const interval = setInterval(() => {
      setRestSecondsRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
    // restSecondsRemaining is intentionally omitted: the effect should only
    // fire when a *new* rest period starts (trigger increments), not on each tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restTimerTrigger])

  // ── Supabase Sync ─────────────────────────────────────────────────────────

  const saveToSupabase = useCallback(async (exercisesState: WorkoutExercise[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || exercisesState.length === 0) return

    const effectiveStartTime = startTime || Date.now()
    if (!activeLogIdRef.current) {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: user.id,
          start_time: new Date(effectiveStartTime).toISOString(),
          exercises_data: exercisesState,
        })
        .select('id')
        .single()

      if (data) activeLogIdRef.current = data.id
      if (error) console.error('Error creating log:', error)
    } else {
      const { error } = await supabase
        .from('workout_logs')
        .update({ exercises_data: exercisesState })
        .eq('id', activeLogIdRef.current)
      if (error) console.error('Error updating log:', error)
    }
  }, [supabase, startTime])

  const getCurrentVolume = (exercise: WorkoutExercise | undefined) => {
    if (!exercise) return 0
    return exercise.sets.reduce((sum, set) => {
      if (!set.completed) return sum
      const w = parseFloat(set.weight) || 0
      const r = parseFloat(set.reps) || 0
      return sum + w * r
    }, 0)
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  // B1 fix: properly deep-clone the nested set object before mutating the field.
  const updateSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIndex ? { ...s, [field]: value } : s),
      }
    }))
  }

  // B2 fix: same deep-clone approach.
  const adjustSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', delta: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) => {
          if (si !== setIndex) return s
          const currentVal = parseFloat(s[field]) || 0
          const newVal = Math.max(0, currentVal + delta)
          return { ...s, [field]: newVal.toString() }
        }),
      }
    }))
  }

  const completeSet = async (exIndex: number, setIndex: number) => {
    if (!isRunning) {
      setIsRunning(true)
      if (!startTime) setStartTime(Date.now())
    }

    const newExercises = exercises.map((ex, ei) => {
      if (ei !== exIndex) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIndex ? { ...s, completed: true } : s),
      }
    })
    setExercises(newExercises)

    // Save to Supabase in background
    saveToSupabase(newExercises)

    // B3 fix: increment the trigger to fire a new rest timer effect.
    setRestTimerTrigger(t => t + 1)
    setRestSecondsRemaining(60)

    const isLastSet = setIndex === exercises[exIndex].sets.length - 1
    if (isLastSet && exIndex < newExercises.length - 1) {
      setTimeout(() => setCurrentExerciseIndex(exIndex + 1), 500)
    }
  }

  const undoSet = (exIndex: number, setIndex: number) => {
    const newExercises = exercises.map((ex, ei) => {
      if (ei !== exIndex) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIndex ? { ...s, completed: false } : s),
      }
    })
    setExercises(newExercises)
    setRestSecondsRemaining(null)
    saveToSupabase(newExercises)
  }

  const addSet = (exIndex: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      const lastSet = ex.sets[ex.sets.length - 1]
      const newSet: SetData = {
        id: window.crypto.randomUUID(),
        weight: lastSet?.weight ?? '20',
        reps: lastSet?.reps ?? '10',
        completed: false,
      }
      return { ...ex, sets: [...ex.sets, newSet] }
    }))
  }

  const removeSet = (exIndex: number) => {
    setExercises(prev => prev.map((ex, ei) => {
      if (ei !== exIndex) return ex
      if (ex.sets.length <= 1) {
        toast.error(language === 'bn' ? 'কমপক্ষে একটি সেট থাকা আবশ্যক' : 'Exercise must have at least 1 set')
        return ex
      }
      return { ...ex, sets: ex.sets.slice(0, -1) }
    }))
  }

  const removeExercise = (exIndex: number) => {
    setExercises(prev => {
      const updated = prev.filter((_, idx) => idx !== exIndex)
      if (currentExerciseIndex >= updated.length) {
        setCurrentExerciseIndex(Math.max(0, updated.length - 1))
      }
      if (updated.length === 0) {
        setElapsedSeconds(0)
        setIsRunning(false)
        setStartTime(null)
        setRestSecondsRemaining(null)
      }
      saveToSupabase(updated)
      return updated
    })
    toast.success(language === 'bn' ? 'ব্যায়াম মুছে ফেলা হয়েছে' : 'Exercise removed')
  }

  const discardWorkout = () => {
    setIsDiscardConfirmOpen(true)
  }

  const handleConfirmDiscard = () => {
    localStorage.removeItem(ACTIVE_WORKOUT_KEY)
    toast.info(language === 'bn' ? 'ওয়ার্কআউট বাতিল করা হয়েছে' : 'Workout discarded')
    router.push('/workout')
  }


  const skipRest = () => setRestSecondsRemaining(null)


  // ── Exercise Selector ─────────────────────────────────────────────────────

  const openSelector = async () => {
    setIsSelecting(true)
    if (dbExercises.length === 0) {
      const { data } = await supabase.from('exercises').select('id, name, primary_muscle').order('name')
      if (data) setDbExercises(data)
    }
  }

  const addExerciseToWorkout = (dbEx: DBExercise) => {
    setExercises(prev => {
      if (prev.length === 0) setCurrentExerciseIndex(0)
      return [
        ...prev,
        {
          exercise_id: dbEx.id,
          name: dbEx.name,
          sets: [{ id: window.crypto.randomUUID(), weight: '20', reps: '10', completed: false }],
        },
      ]
    })
    setIsSelecting(false)
    setSearchQuery('')
  }

  const filteredDbExercises = dbExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ── Finish Workout ────────────────────────────────────────────────────────

  const finishWorkout = async () => {
    if (exercises.length === 0) {
      toast.error(language === 'bn' ? 'শেষ করার আগে অন্তত একটি ব্যায়াম যোগ করুন।' : 'Add at least one exercise before finishing.')
      return
    }
    setIsFinishing(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const effectiveStartTime = startTime || Date.now()
        if (activeLogIdRef.current) {
          await supabase
            .from('workout_logs')
            .update({ end_time: new Date().toISOString(), exercises_data: exercises })
            .eq('id', activeLogIdRef.current)
        } else {
          await supabase.from('workout_logs').insert({
            user_id: user.id,
            start_time: new Date(effectiveStartTime).toISOString(),
            end_time: new Date().toISOString(),
            exercises_data: exercises,
          })
        }
      }

      localStorage.removeItem(ACTIVE_WORKOUT_KEY)

      // B15 fix: show success toast before navigating away
      toast.success(dict.workout.workoutSaved)
      router.push('/')
    } catch (err) {
      console.error('Error finishing workout:', err)
      toast.error(language === 'bn' ? 'সংরক্ষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Failed to save workout. Please try again.')
      setIsFinishing(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  // B13 fix: show a skeleton loader instead of returning null
  if (!isLoaded) return <WorkoutSkeleton />

  const activeExercise = exercises[currentExerciseIndex]
  const currentSetIndex = activeExercise ? activeExercise.sets.findIndex(s => !s.completed) : -1
  const activeSet = currentSetIndex !== -1 ? activeExercise.sets[currentSetIndex] : null

  return (
    <div className="flex flex-col min-h-screen bg-black pb-6 overflow-x-hidden selection:bg-emerald-500/30">

      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold transition-all active:scale-95 cursor-pointer ${
            isRunning
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
              : elapsedSeconds > 0
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] font-sans'
          }`}
          aria-label={isRunning ? dict.workout.pauseTimer : elapsedSeconds > 0 ? dict.workout.resumeTimer : dict.workout.startTimer}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-emerald-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </>
          ) : elapsedSeconds > 0 ? (
            <>
              <Play className="w-3.5 h-3.5 fill-amber-400" />
              <span>{formatTime(elapsedSeconds)}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{dict.workout.startTimer}</span>
            </>
          )}
        </button>

        {/* Progress Dots */}
        <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">
          {exercises.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentExerciseIndex(idx)}
              aria-label={`Go to exercise ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentExerciseIndex
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : idx < currentExerciseIndex
                  ? 'bg-emerald-900'
                  : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            onClick={discardWorkout}
            variant="ghost"
            className="h-9 px-2 sm:px-2.5 text-xs text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
            title={dict.workout.discardWorkout}
          >
            <Trash2 className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">{dict.workout.discardWorkout}</span>
          </Button>

          <Button
            onClick={finishWorkout}
            disabled={isFinishing}
            className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] h-9 px-3 sm:px-4 text-xs sm:text-sm"
          >
            {isFinishing ? dict.workout.saving : dict.workout.finish}
          </Button>
        </div>
      </header>

      {/* Main Gym Mode View */}
      <main className="flex-1 flex flex-col pt-6 z-10 px-4">

        {exercises.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <Dumbbell className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{dict.workout.workoutStarted}</h2>
            <p className="text-zinc-500 text-sm max-w-[250px] mb-8">{dict.workout.workoutStartedSub}</p>
            <Button onClick={openSelector} className="w-full max-w-xs h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg border border-white/10 shadow-lg">
              <Plus className="w-6 h-6 mr-2 text-emerald-500" />
              {dict.workout.addExercise}
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">

            {/* Exercise Header Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
                disabled={currentExerciseIndex === 0}
                className="p-3 bg-zinc-900 rounded-full text-zinc-400 disabled:opacity-30 transition-opacity"
                aria-label="Previous exercise"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center px-4 flex-1">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]">
                  <Dumbbell className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight mb-1">{activeExercise.name}</h2>

                <button
                  onClick={() => removeExercise(currentExerciseIndex)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-colors mb-2 cursor-pointer"
                  title={dict.workout.removeExercise}
                >
                  <Trash2 className="w-3 h-3 text-zinc-500 group-hover:text-red-400" />
                  <span>{dict.workout.removeExercise}</span>
                </button>

                {previousStats[activeExercise.exercise_id] && (
                  <p className="text-xs text-zinc-500 mb-2">{dict.workout.last}: {previousStats[activeExercise.exercise_id]}</p>
                )}

                <div className="flex flex-wrap justify-center items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-bold bg-zinc-900 px-3 py-1.5 rounded-xl text-white border border-white/10 shadow-sm">
                    {dict.workout.volume}: {getCurrentVolume(activeExercise).toLocaleString()} {dict.common.kg}
                  </div>

                  {previousVolumes[activeExercise.exercise_id] !== undefined && (() => {
                    const prev = previousVolumes[activeExercise.exercise_id]
                    const curr = getCurrentVolume(activeExercise)
                    const diff = curr - prev
                    if (diff > 0) return (
                      <div className="flex items-center gap-1 text-sm font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        ▲ +{diff.toLocaleString()} {dict.common.kg}
                      </div>
                    )
                    if (diff < 0 && activeExercise.sets.every(s => s.completed)) return (
                      <div className="flex items-center gap-1 text-sm font-bold bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl border border-orange-500/20">
                        ▼ {diff.toLocaleString()} {dict.common.kg}
                      </div>
                    )
                    return null
                  })()}

                  {personalRecords[activeExercise.exercise_id] !== undefined &&
                    getCurrentVolume(activeExercise) > 0 &&
                    getCurrentVolume(activeExercise) > personalRecords[activeExercise.exercise_id] && (
                      <div className="flex items-center gap-1 text-sm font-black bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] animate-pulse">
                        🏆 {dict.workout.pr}
                      </div>
                    )}
                </div>
              </div>

              <button
                onClick={() => setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))}
                disabled={currentExerciseIndex === exercises.length - 1}
                className="p-3 bg-zinc-900 rounded-full text-zinc-400 disabled:opacity-30 transition-opacity"
                aria-label="Next exercise"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Active Set UI */}
            {activeSet ? (
              <div className="flex-1 flex flex-col justify-end pb-8">
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                      {dict.workout.set} {currentSetIndex + 1} <span className="text-zinc-500 font-normal">{dict.workout.of} {activeExercise.sets.length}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Weight Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-zinc-500 text-sm font-semibold tracking-wider uppercase mb-3">{dict.workout.weight}</label>
                      <div className="flex items-center gap-2 w-full bg-black/50 p-1.5 rounded-2xl border border-white/5">
                        <button
                          onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'weight', -2.5)}
                          className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0"
                          aria-label="Decrease weight"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <Input
                          type="text"
                          inputMode="decimal"
                          value={activeSet.weight}
                          onChange={(e) => updateSet(currentExerciseIndex, currentSetIndex, 'weight', e.target.value)}
                          className="flex-1 min-w-0 h-10 text-center text-2xl font-black bg-transparent border-none focus-visible:ring-0 px-0 text-white"
                          suppressHydrationWarning
                        />
                        <button
                          onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'weight', 2.5)}
                          className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0"
                          aria-label="Increase weight"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Reps Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-zinc-500 text-sm font-semibold tracking-wider uppercase mb-3">{dict.workout.reps}</label>
                      <div className="flex items-center gap-2 w-full bg-black/50 p-1.5 rounded-2xl border border-white/5">
                        <button
                          onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'reps', -1)}
                          className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0"
                          aria-label="Decrease reps"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={activeSet.reps}
                          onChange={(e) => updateSet(currentExerciseIndex, currentSetIndex, 'reps', e.target.value)}
                          className="flex-1 min-w-0 h-10 text-center text-2xl font-black bg-transparent border-none focus-visible:ring-0 px-0 text-white"
                          suppressHydrationWarning
                        />
                        <button
                          onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'reps', 1)}
                          className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0"
                          aria-label="Increase reps"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => completeSet(currentExerciseIndex, currentSetIndex)}
                    className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all"
                  >
                    <Check className="w-6 h-6 mr-2" strokeWidth={3} />
                    {dict.workout.completeSet}
                  </Button>
                </div>
              </div>
            ) : (
              /* All Sets Completed View */
              <div className="flex-1 flex flex-col justify-end pb-8">
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{dict.workout.exerciseComplete}</h3>
                  <p className="text-zinc-400 mb-8">{activeExercise.sets.length} {dict.workout.setsFinished}</p>

                  <div className="flex flex-col gap-3">
                    {currentExerciseIndex < exercises.length - 1 ? (
                      <Button
                        onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                        className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                      >
                        {dict.workout.nextExercise}
                      </Button>
                    ) : (
                      <Button
                        onClick={finishWorkout}
                        disabled={isFinishing}
                        className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                      >
                        {isFinishing ? dict.workout.saving : dict.workout.finishWorkout}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      onClick={() => undoSet(currentExerciseIndex, activeExercise.sets.length - 1)}
                      className="w-full h-14 rounded-2xl text-zinc-400 hover:text-white"
                    >
                      {dict.workout.undoLastSet}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex gap-2.5 mt-auto pt-4">
              <Button onClick={() => addSet(currentExerciseIndex)} variant="outline" className="flex-1 h-12 rounded-xl border-dashed border-white/20 bg-transparent hover:bg-zinc-900 hover:text-white text-zinc-300">
                <Plus className="w-4 h-4 mr-1.5 text-emerald-400" /> {dict.workout.addSet}
              </Button>
              {activeExercise.sets.length > 1 && (
                <Button 
                  onClick={() => removeSet(currentExerciseIndex)} 
                  variant="outline" 
                  className="h-12 px-3.5 rounded-xl border-white/10 bg-zinc-950 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 transition-colors"
                  title={dict.workout.removeSet}
                >
                  <Minus className="w-4 h-4 mr-1 text-red-400" /> {dict.workout.removeSet}
                </Button>
              )}
              <Button onClick={openSelector} variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">
                <Search className="w-4 h-4 mr-1.5" /> {dict.workout.findExercise}
              </Button>
            </div>


          </div>
        )}
      </main>

      {/* Rest Timer Overlay */}
      {restSecondsRemaining !== null && restSecondsRemaining > 0 && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] flex flex-col items-center shadow-2xl">
            <Timer className="w-12 h-12 text-emerald-500 mb-6" />
            <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">{dict.workout.rest}</h3>
            <div className="text-7xl font-black text-white font-mono mb-8 tracking-tighter">
              {formatTime(restSecondsRemaining)}
            </div>
            <Button onClick={skipRest} className="h-14 px-8 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-lg border border-white/5 transition-all">
              <SkipForward className="w-5 h-5 mr-2" />
              {dict.workout.skipRest}
            </Button>
          </div>
        </div>
      )}

      {/* Full Screen Exercise Selector Overlay */}
      {isSelecting && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <header className="flex items-center gap-4 p-4 border-b border-white/10">
            <Button variant="ghost" size="icon" onClick={() => setIsSelecting(false)} className="text-zinc-400 hover:text-white">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                autoFocus
                type="text"
                placeholder={dict.workout.searchExercises}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-zinc-900 border-none rounded-xl text-white focus-visible:ring-1 focus-visible:ring-emerald-500"
                suppressHydrationWarning
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
            {dbExercises.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">{dict.workout.loading}</div>
            ) : filteredDbExercises.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">{dict.workout.noExercisesFound}</div>
            ) : (
              filteredDbExercises.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => addExerciseToWorkout(ex)}
                  className="flex items-center gap-4 p-4 bg-zinc-950 border border-white/5 rounded-2xl cursor-pointer hover:bg-zinc-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{ex.name}</h4>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{ex.primary_muscle}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom Discard Workout Confirmation Modal */}
      <ConfirmModal
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={handleConfirmDiscard}
        title={language === 'bn' ? 'ওয়ার্কআউট বাতিল করবেন?' : 'Discard Workout?'}
        description={
          language === 'bn'
            ? 'আপনি কি নিশ্চিত যে এই ওয়ার্কআউট সেশনটি বাতিল করতে চান? আপনার সব আনসেভড ডেটা মুছে যাবে।'
            : 'Are you sure you want to discard this workout? All logged sets and session progress will be lost.'
        }
        confirmText={dict.workout.discardWorkout}
        cancelText={language === 'bn' ? 'চালু রাখুন' : 'Keep Workout'}
        variant="danger"
        icon="trash"
      />
    </div>
  )
}


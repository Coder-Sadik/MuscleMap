'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Plus, Search, Dumbbell, Timer, Play, ChevronRight, ChevronLeft, SkipForward, Info, Minus } from 'lucide-react'

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

const LOCAL_STORAGE_KEY = 'muscles_map_active_workout'

export default function ActiveWorkout() {
  const router = useRouter()
  const supabase = createClient()
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const activeLogIdRef = useRef<string | null>(null)

  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [startTime, setStartTime] = useState<number>(() => Date.now())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  
  // Gym Mode State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null)
  const [previousStats, setPreviousStats] = useState<Record<string, string>>({})
  const [previousVolumes, setPreviousVolumes] = useState<Record<string, number>>({})
  const [personalRecords, setPersonalRecords] = useState<Record<string, number>>({})
  
  // Selector State
  const [isSelecting, setIsSelecting] = useState(false)
  const [dbExercises, setDbExercises] = useState<DBExercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isFinishing, setIsFinishing] = useState(false)

  // Load from LocalStorage on mount and Fetch Previous Stats
  useEffect(() => {
    const initializeWorkout = async () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      let initialExercises: WorkoutExercise[] = []
      let loadedStartTime = Date.now()

      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          loadedStartTime = parsed.startTime || Date.now()
          initialExercises = parsed.exercises || []
        } catch (e) {
          console.error("Failed to parse saved workout", e)
        }
      }
      
      setStartTime(loadedStartTime)

      // Fetch previous stats for autofill and PRs
      const { data: { user } } = await supabase.auth.getUser()
      if (user && initialExercises.length > 0) {
        const { data } = await supabase
          .from('workout_logs')
          .select('exercises_data')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(100) // Fetch up to 100 past logs to compute PRs

        const pastStats: Record<string, { weight: string, reps: string }> = {}
        const pastStrings: Record<string, string> = {}
        const prevVols: Record<string, number> = {}
        const prVols: Record<string, number> = {}

        if (data) {
          for (let i = 0; i < data.length; i++) {
            const log = data[i]
            const pastExercises = log.exercises_data as WorkoutExercise[]
            if (Array.isArray(pastExercises)) {
              for (const pEx of pastExercises) {
                // Calculate volume for this past exercise
                let logVolume = 0
                let hasCompletedSets = false
                if (pEx.sets) {
                   for (const s of pEx.sets) {
                     if (s.completed) {
                       const w = parseFloat(s.weight) || 0
                       const r = parseFloat(s.reps) || 0
                       logVolume += (w * r)
                       hasCompletedSets = true
                     }
                   }
                }
                
                // Track All-Time PR
                if (hasCompletedSets) {
                   if (!prVols[pEx.exercise_id] || logVolume > prVols[pEx.exercise_id]) {
                     prVols[pEx.exercise_id] = logVolume
                   }
                }

                // Track most recent stats (for the first matching log only, since it's ordered descending by time)
                if (!pastStats[pEx.exercise_id] && pEx.sets && pEx.sets.length > 0) {
                  const validSet = pEx.sets.find(s => s.completed && s.weight && s.reps) || pEx.sets[0]
                  if (validSet) {
                    pastStats[pEx.exercise_id] = { weight: validSet.weight, reps: validSet.reps }
                    pastStrings[pEx.exercise_id] = `${pEx.sets.length} sets of ${validSet.reps} @ ${validSet.weight}kg`
                    if (hasCompletedSets) {
                      prevVols[pEx.exercise_id] = logVolume
                    }
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
              weight: s.weight || (stats ? stats.weight : '20'), // Mock if no history
              reps: s.reps || (stats ? stats.reps : '10')
            }))
          }
        })
      }

      setExercises(initialExercises)
      setIsLoaded(true)
    }

    initializeWorkout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        startTime,
        exercises
      }))
    }
  }, [exercises, startTime, isLoaded])

  // Workout Duration Timer logic
  useEffect(() => {
    if (!isLoaded) return
    timerInterval.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current)
    }
  }, [startTime, isLoaded])

  // Rest Timer logic
  useEffect(() => {
    if (restSecondsRemaining === null || restSecondsRemaining <= 0) return
    const interval = setInterval(() => {
      setRestSecondsRemaining(prev => prev !== null ? prev - 1 : null)
    }, 1000)
    return () => clearInterval(interval)
  }, [restSecondsRemaining])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // --- Supabase Sync ---
  const saveToSupabase = async (exercisesState: WorkoutExercise[]) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (!activeLogIdRef.current) {
      const { data, error } = await supabase.from('workout_logs').insert({
        user_id: user.id,
        start_time: new Date(startTime).toISOString(),
        exercises_data: exercisesState
      }).select('id').single()
      
      if (data) activeLogIdRef.current = data.id
      if (error) console.error("Error creating log:", error)
    } else {
      const { error } = await supabase.from('workout_logs').update({
        exercises_data: exercisesState
      }).eq('id', activeLogIdRef.current)
      if (error) console.error("Error updating log:", error)
    }
  }

  const getCurrentVolume = (exercise: WorkoutExercise | undefined) => {
    if (!exercise) return 0
    return exercise.sets.reduce((sum, set) => {
      if (!set.completed) return sum
      const w = parseFloat(set.weight) || 0
      const r = parseFloat(set.reps) || 0
      return sum + (w * r)
    }, 0)
  }

  // --- Actions ---

  const updateSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newExercises = [...exercises]
    newExercises[exIndex].sets[setIndex][field] = value
    setExercises(newExercises)
  }

  const adjustSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', delta: number) => {
    const newExercises = [...exercises]
    const currentVal = parseFloat(newExercises[exIndex].sets[setIndex][field]) || 0
    const newVal = Math.max(0, currentVal + delta)
    newExercises[exIndex].sets[setIndex][field] = newVal.toString()
    setExercises(newExercises)
  }

  const completeSet = async (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exIndex].sets[setIndex].completed = true
    setExercises(newExercises)
    
    // Save to Supabase immediately in background
    saveToSupabase(newExercises)

    // Check if this was the last set of the exercise
    const isLastSet = setIndex === newExercises[exIndex].sets.length - 1
    
    // Start Rest Timer
    setRestSecondsRemaining(60)

    // Auto-advance
    if (isLastSet && exIndex < newExercises.length - 1) {
      // Small delay before advancing to next exercise so user sees completion
      setTimeout(() => {
        setCurrentExerciseIndex(exIndex + 1)
      }, 500)
    }
  }

  const undoSet = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exIndex].sets[setIndex].completed = false
    setExercises(newExercises)
    setRestSecondsRemaining(null) // Cancel rest timer if they undid
    saveToSupabase(newExercises)
  }

  const addSet = (exIndex: number) => {
    const newExercises = [...exercises]
    const currentEx = newExercises[exIndex]
    
    let defaultWeight = '20'
    let defaultReps = '10'
    if (currentEx.sets.length > 0) {
      const lastSet = currentEx.sets[currentEx.sets.length - 1]
      defaultWeight = lastSet.weight
      defaultReps = lastSet.reps
    }

    currentEx.sets.push({
      id: window.crypto.randomUUID(),
      weight: defaultWeight,
      reps: defaultReps,
      completed: false
    })
    setExercises(newExercises)
  }

  const skipRest = () => setRestSecondsRemaining(null)

  // --- Exercise Selector ---

  const openSelector = async () => {
    setIsSelecting(true)
    if (dbExercises.length === 0) {
      const { data } = await supabase.from('exercises').select('id, name, primary_muscle').order('name')
      if (data) setDbExercises(data)
    }
  }

  const addExerciseToWorkout = (dbEx: DBExercise) => {
    setExercises([...exercises, {
      exercise_id: dbEx.id,
      name: dbEx.name,
      sets: [{ id: window.crypto.randomUUID(), weight: '20', reps: '10', completed: false }]
    }])
    setIsSelecting(false)
    setSearchQuery('')
    if (exercises.length === 0) {
      setCurrentExerciseIndex(0)
    }
  }

  const filteredDbExercises = dbExercises.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // --- Finish Workout ---
  const finishWorkout = async () => {
    if (exercises.length === 0) {
      alert("Add some exercises first!")
      return
    }
    setIsFinishing(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      if (activeLogIdRef.current) {
        // Complete the existing log
        await supabase.from('workout_logs').update({
          end_time: new Date().toISOString(),
          exercises_data: exercises
        }).eq('id', activeLogIdRef.current)
      } else {
        // Workout was started but no sets were completed, create a finished log now
        await supabase.from('workout_logs').insert({
          user_id: user.id,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date().toISOString(),
          exercises_data: exercises
        })
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY)
    router.push('/')
  }

  if (!isLoaded) return null 

  const activeExercise = exercises[currentExerciseIndex]
  const currentSetIndex = activeExercise ? activeExercise.sets.findIndex(s => !s.completed) : -1
  const activeSet = currentSetIndex !== -1 ? activeExercise.sets[currentSetIndex] : null

  return (
    <div className="flex flex-col min-h-screen bg-black pb-6 overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xl font-bold">
          <Timer className="w-5 h-5" />
          {formatTime(elapsedSeconds)}
        </div>
        
        {/* Progress Dots */}
        <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">
          {exercises.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-colors ${idx === currentExerciseIndex ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : idx < currentExerciseIndex ? 'bg-emerald-900' : 'bg-zinc-800'}`} 
            />
          ))}
        </div>

        <Button onClick={finishWorkout} disabled={isFinishing} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
          {isFinishing ? "Saving..." : "Finish"}
        </Button>
      </header>

      {/* Main Gym Mode View */}
      <main className="flex-1 flex flex-col pt-6 z-10 px-4">
        
        {exercises.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <Play className="w-8 h-8 text-zinc-700 ml-1" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Workout Started</h2>
            <p className="text-zinc-500 text-sm max-w-[250px] mb-8">Add your first exercise to begin tracking your sets and reps.</p>
            <Button onClick={openSelector} className="w-full max-w-xs h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg border border-white/10 shadow-lg">
              <Plus className="w-6 h-6 mr-2 text-emerald-500" />
              Add Exercise
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
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center text-center px-4 flex-1">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]">
                  <Dumbbell className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-white leading-tight mb-3">{activeExercise.name}</h2>
                
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <div className="flex items-center gap-1 text-sm font-bold bg-zinc-900 px-3 py-1.5 rounded-xl text-white border border-white/10 shadow-sm">
                    Vol: {getCurrentVolume(activeExercise).toLocaleString()} kg
                  </div>

                  {previousVolumes[activeExercise.exercise_id] !== undefined && (() => {
                    const prev = previousVolumes[activeExercise.exercise_id]
                    const curr = getCurrentVolume(activeExercise)
                    const diff = curr - prev
                    
                    if (diff > 0) {
                      return (
                        <div className="flex items-center gap-1 text-sm font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                          ▲ +{diff.toLocaleString()} kg
                        </div>
                      )
                    } else if (diff < 0 && activeExercise.sets.every(s => s.completed)) {
                      return (
                        <div className="flex items-center gap-1 text-sm font-bold bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl border border-orange-500/20">
                          ▼ {diff.toLocaleString()} kg
                        </div>
                      )
                    }
                    return null
                  })()}

                  {personalRecords[activeExercise.exercise_id] !== undefined && 
                   getCurrentVolume(activeExercise) > 0 &&
                   getCurrentVolume(activeExercise) > personalRecords[activeExercise.exercise_id] && (
                    <div className="flex items-center gap-1 text-sm font-black bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] animate-pulse">
                      🏆 PR!
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))}
                disabled={currentExerciseIndex === exercises.length - 1}
                className="p-3 bg-zinc-900 rounded-full text-zinc-400 disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Active Set UI */}
            {activeSet ? (
              <div className="flex-1 flex flex-col justify-end pb-8">
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Set {currentSetIndex + 1} <span className="text-zinc-500 font-normal">of {activeExercise.sets.length}</span></h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Weight Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-zinc-500 text-sm font-semibold tracking-wider uppercase mb-3">Weight (kg)</label>
                      <div className="flex items-center gap-2 w-full bg-black/50 p-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'weight', -2.5)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0">
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
                        <button onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'weight', 2.5)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Reps Input */}
                    <div className="flex flex-col items-center">
                      <label className="text-zinc-500 text-sm font-semibold tracking-wider uppercase mb-3">Reps</label>
                      <div className="flex items-center gap-2 w-full bg-black/50 p-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'reps', -1)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0">
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
                        <button onClick={() => adjustSet(currentExerciseIndex, currentSetIndex, 'reps', 1)} className="w-10 h-10 flex items-center justify-center bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 active:scale-95 transition-all shrink-0">
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => completeSet(currentExerciseIndex, currentSetIndex)}
                    className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98] transition-all"
                  >
                    Complete Set
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
                  <h3 className="text-2xl font-black text-white mb-2">Exercise Complete</h3>
                  <p className="text-zinc-400 mb-8">{activeExercise.sets.length} sets finished.</p>
                  
                  <div className="flex flex-col gap-3">
                    {currentExerciseIndex < exercises.length - 1 ? (
                      <Button 
                        onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                        className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                      >
                        Next Exercise
                      </Button>
                    ) : (
                      <Button 
                        onClick={finishWorkout}
                        disabled={isFinishing}
                        className="w-full h-14 rounded-2xl bg-emerald-500 text-white font-bold text-lg shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                      >
                        {isFinishing ? "Saving..." : "Finish Workout"}
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      onClick={() => undoSet(currentExerciseIndex, activeExercise.sets.length - 1)}
                      className="w-full h-14 rounded-2xl text-zinc-400 hover:text-white"
                    >
                      Undo Last Set
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Bar */}
            <div className="flex gap-4 mt-auto">
              <Button onClick={() => addSet(currentExerciseIndex)} variant="outline" className="flex-1 h-12 rounded-xl border-dashed border-white/20 bg-transparent hover:bg-zinc-900 hover:text-white text-zinc-400">
                <Plus className="w-4 h-4 mr-2" /> Add Set
              </Button>
              <Button onClick={openSelector} variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md">
                <Search className="w-4 h-4 mr-2" /> Find Ex.
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
            <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-sm mb-2">Rest</h3>
            <div className="text-7xl font-black text-white font-mono mb-8 tracking-tighter">
              {formatTime(restSecondsRemaining)}
            </div>
            <Button onClick={skipRest} className="h-14 px-8 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-lg border border-white/5 transition-all">
              <SkipForward className="w-5 h-5 mr-2" />
              Skip Rest
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
                placeholder="Search exercises..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-zinc-900 border-none rounded-xl text-white focus-visible:ring-1 focus-visible:ring-emerald-500"
                suppressHydrationWarning
              />
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
            {dbExercises.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">Loading...</div>
            ) : filteredDbExercises.length === 0 ? (
              <div className="text-center text-zinc-500 mt-10">No exercises found.</div>
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
    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Check, Plus, X, Search, Dumbbell, Timer, Play } from 'lucide-react'

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

  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [startTime, setStartTime] = useState<number>(() => Date.now())
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  
  // Selector State
  const [isSelecting, setIsSelecting] = useState(false)
  const [dbExercises, setDbExercises] = useState<DBExercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStartTime(parsed.startTime)
        setExercises(parsed.exercises || [])
      } catch (e) {
        console.error("Failed to parse saved workout", e)
      }
    } else {
      setStartTime(Date.now())
    }
    setIsLoaded(true)
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

  // Timer logic
  useEffect(() => {
    if (!isLoaded) return
    
    timerInterval.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current)
    }
  }, [startTime, isLoaded])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // --- Actions ---

  const addSet = (exIndex: number) => {
    const newExercises = [...exercises]
    const currentEx = newExercises[exIndex]
    
    // Copy weight/reps from previous set if exists
    let defaultWeight = ''
    let defaultReps = ''
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

  // const removeSet = (exIndex: number, setIndex: number) => {
  //   const newExercises = [...exercises]
  //   newExercises[exIndex].sets.splice(setIndex, 1)
  //   setExercises(newExercises)
  // }

  const updateSet = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: string) => {
    const newExercises = [...exercises]
    newExercises[exIndex].sets[setIndex][field] = value
    setExercises(newExercises)
  }

  const toggleSetComplete = (exIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exIndex].sets[setIndex].completed = !newExercises[exIndex].sets[setIndex].completed
    setExercises(newExercises)
  }

  const removeExercise = (exIndex: number) => {
    const newExercises = [...exercises]
    newExercises.splice(exIndex, 1)
    setExercises(newExercises)
  }

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
      sets: [{ id: window.crypto.randomUUID(), weight: '', reps: '', completed: false }]
    }])
    setIsSelecting(false)
    setSearchQuery('')
  }

  const filteredDbExercises = dbExercises.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // --- Finish Workout ---
  const finishWorkout = async () => {
    if (exercises.length === 0) {
      alert("Add some exercises first!")
      return
    }

    setIsSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Filter out empty/uncompleted sets if desired, but saving all is fine
      const { error } = await supabase.from('workout_logs').insert({
        user_id: user.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date().toISOString(),
        exercises_data: exercises
      })

      if (error) {
        console.error("Error saving workout", error)
        alert("Failed to save workout.")
        setIsSaving(false)
        return
      }
    }

    // Success
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    router.push('/')
  }

  if (!isLoaded) return null // Prevent hydration mismatch

  return (
    <div className="flex flex-col min-h-screen bg-black pb-32 overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xl font-bold">
          <Timer className="w-5 h-5" />
          {formatTime(elapsedSeconds)}
        </div>
        <Button onClick={finishWorkout} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
          {isSaving ? "Saving..." : "Finish"}
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-24 space-y-8 z-10">
        
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <Play className="w-8 h-8 text-zinc-700 ml-1" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Workout Started</h2>
            <p className="text-zinc-500 text-sm max-w-[250px]">Add your first exercise to begin tracking your sets and reps.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {exercises.map((ex, exIndex) => (
              <Card key={exIndex} className="bg-zinc-950/50 backdrop-blur-md border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <CardContent className="p-0">
                  {/* Exercise Header */}
                  <div className="flex items-center justify-between p-4 bg-zinc-900/50 border-b border-white/5">
                    <h3 className="font-bold text-emerald-400 text-lg">{ex.name}</h3>
                    <button onClick={() => removeExercise(exIndex)} className="text-zinc-500 hover:text-rose-500 transition-colors p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Sets Column Headers */}
                  <div className="grid grid-cols-[3rem_1fr_1fr_3rem] gap-2 px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">
                    <div>Set</div>
                    <div>kg</div>
                    <div>Reps</div>
                    <div></div>
                  </div>

                  {/* Sets Rows */}
                  <div className="space-y-1 pb-4">
                    {ex.sets.map((set, setIndex) => (
                      <div key={set.id} className={`grid grid-cols-[3rem_1fr_1fr_3rem] gap-2 px-4 items-center transition-colors ${set.completed ? 'opacity-50 bg-emerald-500/5' : ''}`}>
                        <div className="text-center text-sm font-bold text-zinc-400">
                          {setIndex + 1}
                        </div>
                        <div>
                          <Input 
                            type="number" 
                            inputMode="decimal"
                            value={set.weight}
                            onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                            disabled={set.completed}
                            className="h-10 text-center font-bold text-base bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500 disabled:opacity-100"
                            placeholder="-"
                            suppressHydrationWarning
                          />
                        </div>
                        <div>
                          <Input 
                            type="number" 
                            inputMode="numeric"
                            value={set.reps}
                            onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                            disabled={set.completed}
                            className="h-10 text-center font-bold text-base bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500 disabled:opacity-100"
                            placeholder="-"
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="flex justify-center">
                          <button 
                            onClick={() => toggleSetComplete(exIndex, setIndex)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              set.completed 
                                ? 'bg-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]' 
                                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                            }`}
                          >
                            <Check className="w-5 h-5" strokeWidth={set.completed ? 3 : 2} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Set Button */}
                  <div className="px-4 pb-4">
                    <Button onClick={() => addSet(exIndex)} variant="ghost" className="w-full text-zinc-400 hover:text-white border border-dashed border-white/10 hover:border-white/30 hover:bg-zinc-900">
                      <Plus className="w-4 h-4 mr-1" /> Add Set
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button onClick={openSelector} className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg border border-white/10 shadow-lg">
          <Plus className="w-6 h-6 mr-2 text-emerald-500" />
          Add Exercise
        </Button>

      </main>

      {/* Full Screen Exercise Selector Overlay */}
      {isSelecting && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom-full duration-300">
          <header className="flex items-center gap-4 p-4 border-b border-white/10">
            <button onClick={() => setIsSelecting(false)} className="p-2 text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
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
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
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

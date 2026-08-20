'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Filter, Dumbbell } from 'lucide-react'
import Link from 'next/link'

type Exercise = {
  id: string
  name: string
  primary_muscle: string
  equipment: string
  difficulty: string
}

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('All')
  const [equipmentFilter, setEquipmentFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchExercises() {
      const { data, error } = await supabase
        .from('exercises')
        .select('id, name, primary_muscle, equipment, difficulty')
        .order('name')
        
      if (data) setExercises(data)
      setIsLoading(false)
    }
    
    fetchExercises()
  }, [])

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscle = muscleFilter === 'All' || ex.primary_muscle === muscleFilter
    const matchesEquipment = equipmentFilter === 'All' || ex.equipment === equipmentFilter
    const matchesDifficulty = difficultyFilter === 'All' || ex.difficulty === difficultyFilter
    
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty
  })

  // Unique values for dropdowns
  const muscles = ['All', ...Array.from(new Set(exercises.map(ex => ex.primary_muscle)))]
  const equipment = ['All', ...Array.from(new Set(exercises.map(ex => ex.equipment)))]
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <Input 
          type="text" 
          placeholder="Search exercises..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-10 pr-4 bg-zinc-950/50 border-white/10 rounded-xl text-white focus-visible:ring-emerald-500"
        />
      </div>

      {/* Filters (Scrollable Row) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <select 
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-xs font-medium text-white outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
        >
          {muscles.map(m => (
            <option key={m} value={m}>{m === 'All' ? 'All Muscles' : m}</option>
          ))}
        </select>
        
        <select 
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-xs font-medium text-white outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
        >
          {equipment.map(e => (
            <option key={e} value={e}>{e === 'All' ? 'All Equipment' : e}</option>
          ))}
        </select>

        <select 
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-xs font-medium text-white outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
        >
          {difficulties.map(d => (
            <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pb-24 space-y-3">
        {isLoading ? (
          <div className="text-center text-sm text-zinc-500 mt-10">Loading library...</div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center text-sm text-zinc-500 mt-10">No exercises found.</div>
        ) : (
          filteredExercises.map(ex => (
            <Link href={`/muscles/${ex.id}`} key={ex.id} className="block">
              <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 hover:bg-zinc-900/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{ex.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {ex.primary_muscle}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                          {ex.equipment}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

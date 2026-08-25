'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Search, Dumbbell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { DBExercise } from './types'
import { FilterDropdown } from '@/components/FilterDropdown'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelect: (exercise: DBExercise) => void
}

export default function ExerciseSelectorSheet({ isOpen, onClose, onSelect }: Props) {
  const { dict } = useLanguage()
  const supabase = createClient()
  const [dbExercises, setDbExercises] = useState<DBExercise[]>([])
  
  const [searchQuery, setSearchQuery] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('All')
  const [equipmentFilter, setEquipmentFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  
  const [isLoading, setIsLoading] = useState(false)

  // B9 fix: stabilise fetchExercises with useCallback
  const fetchExercises = useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('exercises')
      .select('id, name, primary_muscle, equipment, difficulty')
      .order('name')

    if (data) {
      setDbExercises(data)
    } else {
      console.error('Failed to fetch exercises', error)
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    if (isOpen && dbExercises.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchExercises()
    }
  }, [isOpen, dbExercises.length, fetchExercises])

  // P2 fix: memoize filter computations
  const filteredExercises = useMemo(() => dbExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMuscle = muscleFilter === 'All' || ex.primary_muscle === muscleFilter
    const matchesEquipment = equipmentFilter === 'All' || ex.equipment === equipmentFilter
    const matchesDifficulty = difficultyFilter === 'All' || ex.difficulty === difficultyFilter
    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty
  }), [dbExercises, searchQuery, muscleFilter, equipmentFilter, difficultyFilter])

  // Unique values for dropdowns
  const muscles = useMemo(() => ['All', ...Array.from(new Set(dbExercises.map(ex => ex.primary_muscle)))], [dbExercises])
  const equipment = useMemo(() => ['All', ...Array.from(new Set(dbExercises.map(ex => ex.equipment)))], [dbExercises])
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom-full duration-300">
      <header className="flex flex-col gap-4 p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input 
              autoFocus
              type="text" 
              placeholder={dict.muscles.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-zinc-950/50 border-white/10 rounded-xl text-white focus-visible:ring-emerald-500"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Filters (Scrollable Row) */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-hide -mx-4 px-4 relative z-50">
          <FilterDropdown value={muscleFilter} options={muscles} onChange={setMuscleFilter} placeholder={dict.muscles.allMuscles} />
          <FilterDropdown value={equipmentFilter} options={equipment} onChange={setEquipmentFilter} placeholder={dict.muscles.allEquipment} />
          <FilterDropdown value={difficultyFilter} options={difficulties} onChange={setDifficultyFilter} placeholder={dict.muscles.allLevels} />
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="text-center text-sm text-zinc-500 mt-10">{dict.muscles.loadingLibrary}</div>
        ) : filteredExercises.length === 0 ? (
          <div className="text-center text-sm text-zinc-500 mt-10">{dict.muscles.noExercisesFound}</div>
        ) : (
          filteredExercises.map(ex => (
            <div 
              key={ex.id} 
              onClick={() => onSelect(ex)}
              className="block cursor-pointer"
            >
              <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 hover:bg-zinc-900/50 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Dumbbell className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{ex.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {ex.primary_muscle}
                        </span>
                        {ex.equipment && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                            {ex.equipment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

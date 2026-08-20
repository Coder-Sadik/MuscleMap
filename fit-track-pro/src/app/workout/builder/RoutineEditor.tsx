'use client'

import { useState } from 'react'
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BuilderRoutine, BuilderExercise, DBExercise } from './types'
import ExerciseCard from './ExerciseCard'
import ExerciseSelectorSheet from './ExerciseSelectorSheet'

type Props = {
  routine: BuilderRoutine
  onRoutineChange: (routine: BuilderRoutine) => void
}

export default function RoutineEditor({ routine, onRoutineChange }: Props) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement before drag starts, allows normal clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = routine.exercises.findIndex(e => e.id === active.id)
      const newIndex = routine.exercises.findIndex(e => e.id === over.id)
      
      const newExercises = arrayMove(routine.exercises, oldIndex, newIndex)
      onRoutineChange({ ...routine, exercises: newExercises })
    }
  }

  const handleUpdateExercise = (exId: string, field: keyof BuilderExercise, value: number | string) => {
    const newExercises = routine.exercises.map(ex => {
      if (ex.id === exId) {
        return { ...ex, [field]: value }
      }
      return ex
    })
    onRoutineChange({ ...routine, exercises: newExercises })
  }

  const handleRemoveExercise = (exId: string) => {
    const newExercises = routine.exercises.filter(ex => ex.id !== exId)
    onRoutineChange({ ...routine, exercises: newExercises })
  }

  const handleAddExercise = (dbEx: DBExercise) => {
    const newExercise: BuilderExercise = {
      id: window.crypto.randomUUID(),
      exercise_id: dbEx.id,
      name: dbEx.name,
      primary_muscle: dbEx.primary_muscle,
      target_sets: 3,
      target_reps: 10,
      target_weight_kg: 0,
      rest_seconds: 60
    }
    onRoutineChange({ ...routine, exercises: [...routine.exercises, newExercise] })
    setIsSelectorOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 pb-32">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-white">{routine.name}</h2>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={routine.exercises.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {routine.exercises.map(ex => (
              <ExerciseCard 
                key={ex.id}
                exercise={ex}
                onUpdate={(field, val) => handleUpdateExercise(ex.id, field, val)}
                onRemove={() => handleRemoveExercise(ex.id)}
              />
            ))}
            
            {routine.exercises.length === 0 && (
              <div className="text-center p-8 bg-zinc-900/30 rounded-2xl border border-dashed border-white/10 text-zinc-500">
                No exercises added to this routine yet.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Button 
        onClick={() => setIsSelectorOpen(true)}
        className="w-full h-14 mt-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-lg border border-white/10 shadow-lg"
      >
        <Plus className="w-6 h-6 mr-2 text-emerald-500" />
        Add Exercise
      </Button>

      <ExerciseSelectorSheet 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleAddExercise}
      />
    </div>
  )
}

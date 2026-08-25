'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { BuilderExercise } from './types'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  exercise: BuilderExercise
  onUpdate: (field: keyof BuilderExercise, value: number | string) => void
  onRemove: () => void
}

export default function ExerciseCard({ exercise, onUpdate, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: exercise.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`bg-zinc-950/80 backdrop-blur-md border-white/10 overflow-hidden relative ${isDragging ? 'shadow-2xl ring-1 ring-emerald-500' : ''}`}
    >
      <CardContent className="p-0">
        <div className="flex items-center bg-zinc-900/50 border-b border-white/5 p-2">
          <div 
            {...attributes} 
            {...listeners} 
            className="p-2 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-emerald-400 text-lg truncate">{exercise.name}</h3>
          </div>
          <button onClick={onRemove} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 p-4">
          <div className="flex flex-col items-center">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Sets</label>
            <Input 
              type="number"
              inputMode="numeric"
              value={exercise.target_sets || ''}
              onChange={(e) => onUpdate('target_sets', parseInt(e.target.value) || 0)}
              className="h-10 text-center font-bold bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Reps</label>
            <Input 
              type="number"
              inputMode="numeric"
              value={exercise.target_reps || ''}
              onChange={(e) => onUpdate('target_reps', parseInt(e.target.value) || 0)}
              className="h-10 text-center font-bold bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Weight</label>
            <Input 
              type="number"
              inputMode="decimal"
              value={exercise.target_weight_kg || ''}
              onChange={(e) => onUpdate('target_weight_kg', parseFloat(e.target.value) || 0)}
              className="h-10 text-center font-bold bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Rest (s)</label>
            <Input 
              type="number"
              inputMode="numeric"
              value={exercise.rest_seconds || ''}
              onChange={(e) => onUpdate('rest_seconds', parseInt(e.target.value) || 0)}
              className="h-10 text-center font-bold bg-zinc-900/50 border-white/10 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

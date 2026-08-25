'use client'

import Link from 'next/link'
import { X, Dumbbell, Clock, Lightbulb, AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n/LanguageContext'

export type ExerciseDetailData = {
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
}

type Props = {
  exercise: ExerciseDetailData | null
  onClose: () => void
}

export default function ExerciseProcedureModal({ exercise, onClose }: Props) {
  const { dict, language } = useLanguage()

  if (!exercise) return null

  const instructions = exercise.instructions || []
  const mistakes = exercise.common_mistakes || []
  const cautions = exercise.safety_cautions || []

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 p-0 sm:p-4">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Sheet Container */}
      <div 
        className="relative z-10 w-full max-w-lg bg-zinc-950 border border-white/10 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Indicator (Mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <header className="p-5 border-b border-white/10 flex items-start justify-between gap-4 shrink-0 bg-zinc-900/40">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {exercise.difficulty && (
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                  exercise.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                  exercise.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/20'
                }`}>
                  {exercise.difficulty === 'Beginner' ? dict.muscles.beginner :
                   exercise.difficulty === 'Intermediate' ? dict.muscles.intermediate :
                   exercise.difficulty === 'Advanced' ? dict.muscles.advanced : exercise.difficulty}
                </span>
              )}
              {exercise.equipment && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {exercise.equipment}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white truncate tracking-tight">{exercise.name}</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{dict.muscles.target}: <strong className="text-emerald-400 font-semibold">{exercise.primary_muscle}</strong></span>
              {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
                <span className="text-zinc-500">• {exercise.secondary_muscles.join(', ')}</span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label={dict.workout.close}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1 overscroll-contain">
          
          {/* Rest Recommendation */}
          {exercise.rest_recommendation && (
            <div className="flex items-center gap-3 p-3.5 bg-blue-950/20 border border-blue-500/20 rounded-2xl">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">{dict.muscles.recommendedRest}</span>
                <span className="text-zinc-400">{exercise.rest_recommendation} {dict.muscles.betweenSets}</span>
              </div>
            </div>
          )}

          {/* How to Perform / Procedure Steps */}
          {instructions.length > 0 ? (
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                {dict.muscles.howToPerform}
              </h3>
              <div className="space-y-2.5">
                {instructions.map((step, idx) => (
                  <div key={idx} className="flex gap-3 p-3.5 bg-zinc-900/60 border border-white/5 rounded-2xl">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </div>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="p-4 bg-zinc-900/30 rounded-2xl text-center text-xs text-zinc-500">
              {language === 'bn' ? 'এই ব্যায়ামের কোনো নিয়মাবলী পাওয়া যায়নি।' : 'No step-by-step instructions available for this exercise.'}
            </div>
          )}

          {/* Common Mistakes */}
          {mistakes.length > 0 && (
            <section className="space-y-2.5 p-4 bg-orange-950/15 border border-orange-500/20 rounded-2xl">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-400" />
                {dict.muscles.commonMistakes}
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {mistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Safety Cautions */}
          {cautions.length > 0 && (
            <section className="space-y-2.5 p-4 bg-red-950/15 border border-red-500/20 rounded-2xl">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {dict.muscles.safetyCautions}
              </h3>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {cautions.map((caution, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    <span>{caution}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Modal Footer */}
        <footer className="p-4 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between gap-3 shrink-0">
          {exercise.id ? (
            <Link 
              href={`/muscles/${exercise.id}`}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ পৃষ্ঠা দেখুন' : 'Full Guide Page'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : <div />}

          <Button
            onClick={onClose}
            className="px-6 h-10 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors text-sm cursor-pointer"
          >
            {dict.workout.close}
          </Button>
        </footer>
      </div>
    </div>
  )
}

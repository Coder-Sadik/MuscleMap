'use client';

import Link from 'next/link';
import { ChevronLeft, Dumbbell, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Props = {
  exercise: {
    id: string;
    name: string;
    primary_muscle: string;
    secondary_muscles: string[] | null;
    equipment: string;
    difficulty: string;
    instructions: string[] | null;
    common_mistakes: string[] | null;
    safety_cautions: string[] | null;
    rest_recommendation: string | null;
  };
};

export default function ExerciseDetailView({ exercise }: Props) {
  const { dict } = useLanguage();

  const instructions = exercise.instructions || [];
  const mistakes = exercise.common_mistakes || [];
  const cautions = exercise.safety_cautions || [];

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 overflow-x-hidden">
      {/* Dynamic Background Glow based on difficulty */}
      <div className={`absolute top-[-5%] left-[-10%] w-[80%] h-[40%] rounded-full blur-[120px] pointer-events-none opacity-20 ${
        exercise.difficulty === 'Beginner' ? 'bg-emerald-500' :
        exercise.difficulty === 'Intermediate' ? 'bg-blue-500' : 'bg-rose-500'
      }`} />
      
      <main className="flex-1 px-6 pt-12 space-y-8 z-10">
        
        {/* Back Button */}
        <Link href="/muscles" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {dict.muscles.backToLibrary}
        </Link>

        {/* Header Section */}
        <header className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
              exercise.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
              exercise.difficulty === 'Intermediate' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'
            }`}>
              {exercise.difficulty === 'Beginner' ? dict.muscles.beginner :
               exercise.difficulty === 'Intermediate' ? dict.muscles.intermediate :
               exercise.difficulty === 'Advanced' ? dict.muscles.advanced : exercise.difficulty}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {exercise.equipment}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            {exercise.name}
          </h1>
          
          {/* Muscles Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="px-3 py-1 bg-white/10 rounded-lg text-sm font-medium text-white flex items-center">
              {dict.muscles.target}: <span className="text-emerald-400 ml-1 font-bold">{exercise.primary_muscle}</span>
            </div>
            {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
              <div className="px-3 py-1 bg-white/5 rounded-lg text-sm font-medium text-zinc-400 flex items-center">
                {dict.muscles.alsoHits}: {exercise.secondary_muscles.join(', ')}
              </div>
            )}
          </div>
        </header>

        {/* Rest Recommendation */}
        {exercise.rest_recommendation && (
          <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-in fade-in zoom-in-95 duration-500 delay-100 fill-mode-both">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{dict.muscles.recommendedRest}</p>
              <p className="text-xs text-zinc-400">{exercise.rest_recommendation} {dict.muscles.betweenSets}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {instructions.length > 0 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Dumbbell className="w-5 h-5 mr-2 text-emerald-500" />
              {dict.muscles.howToPerform}
            </h2>
            <div className="space-y-4">
              {instructions.map((step: string, index: number) => (
                <div key={index} className="flex gap-4 p-4 bg-zinc-950/50 backdrop-blur-md border border-white/5 rounded-2xl">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-sm pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cautions & Mistakes Grid */}
        <div className="grid gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
          
          {mistakes.length > 0 && (
            <section className="p-5 bg-orange-950/20 border border-orange-500/20 rounded-2xl">
              <h3 className="text-lg font-bold text-orange-400 flex items-center mb-3">
                <Lightbulb className="w-5 h-5 mr-2" />
                {dict.muscles.commonMistakes}
              </h3>
              <ul className="space-y-2">
                {mistakes.map((mistake: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-zinc-300">
                    <span className="text-orange-500 mr-2 mt-0.5">•</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {cautions.length > 0 && (
            <section className="p-5 bg-rose-950/20 border border-rose-500/20 rounded-2xl">
              <h3 className="text-lg font-bold text-rose-400 flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {dict.muscles.safetyCautions}
              </h3>
              <ul className="space-y-2">
                {cautions.map((caution: string, i: number) => (
                  <li key={i} className="flex items-start text-sm text-zinc-300">
                    <span className="text-rose-500 mr-2 mt-0.5">•</span>
                    {caution}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
        </div>

      </main>
    </div>
  );
}

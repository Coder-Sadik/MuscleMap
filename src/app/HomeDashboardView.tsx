'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Activity, Flame, ChevronRight, Clock, Layers } from 'lucide-react';
import Link from 'next/link';
import { StartRoutineButton, StartEmptyButton } from './WorkoutStarters';
import { useLanguage } from '@/lib/i18n/LanguageContext';

type Routine = {
  id: string;
  name: string;
  exercises: {
    exercise_id: string;
    name: string;
    target_sets: number;
    target_reps: number;
    target_weight_kg: number;
  }[];
};

type WorkoutItem = {
  id: string;
  exerciseNames: string;
  duration: string;
  date: string;
  setCount: number;
};

type Props = {
  displayName: string;
  streak: number;
  totalWorkouts: number;
  suggestedRoutine: Routine | null;
  recentWorkouts: WorkoutItem[];
};

export default function HomeDashboardView({
  displayName,
  streak,
  totalWorkouts,
  suggestedRoutine,
  recentWorkouts,
}: Props) {
  const { dict, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      {/* Top Background Glow */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none" />

      <main className="flex-1 px-5 pt-12 space-y-7 z-10">

        {/* Header */}
        <header className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-sm font-semibold tracking-wider text-emerald-500 uppercase">
            {dict.home.welcomeBack}
          </h2>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {dict.home.readyToCrush},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              {displayName}
            </span>?
          </h1>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-700 delay-100 fill-mode-both">
          <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 shadow-lg">
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streak}</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{dict.home.dayStreak}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 shadow-lg">
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
              <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{dict.home.workouts}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Workout / Quick Start */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both space-y-3">
          {suggestedRoutine ? (
            <>
              {/* Suggested Routine Card */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-zinc-900/60 to-zinc-900/80 border border-emerald-500/25 p-5 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                      {dict.home.todaysWorkout}
                    </span>
                    <h2 className="text-xl font-black text-white truncate mt-1">{suggestedRoutine.name}</h2>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-400">
                      <Layers className="w-3.5 h-3.5" />
                      {suggestedRoutine.exercises.length} {dict.home.exercises}
                    </div>
                    {/* Exercise chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {suggestedRoutine.exercises.slice(0, 3).map((ex, i) => (
                        <span key={i} className="text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          {ex.name}
                        </span>
                      ))}
                      {suggestedRoutine.exercises.length > 3 && (
                        <span className="text-[11px] bg-zinc-800 text-zinc-500 px-2.5 py-1 rounded-full">
                          +{suggestedRoutine.exercises.length - 3} {dict.home.more}
                        </span>
                      )}
                    </div>
                  </div>
                  <StartRoutineButton routine={suggestedRoutine} />
                </div>
              </div>

              {/* Empty workout fallback */}
              <StartEmptyButton />
            </>
          ) : (
            <StartEmptyButton />
          )}
        </div>

        {/* Recent Activity */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">{dict.home.recentActivity}</h3>
            <Link href="/progress" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center">
              {dict.home.viewAll} <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentWorkouts.length === 0 ? (
              <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <Dumbbell className="w-8 h-8 text-zinc-600" />
                  <p className="text-zinc-400 text-sm">{dict.home.noWorkoutsYet}</p>
                </CardContent>
              </Card>
            ) : (
              recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-zinc-950/50 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden"
                >
                  <div className="flex items-stretch">
                    <div className="w-1 bg-emerald-500/40 shrink-0" />
                    <div className="flex-1 px-4 py-3">
                      <p className="font-semibold text-white text-sm leading-snug">
                        {workout.exerciseNames}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {workout.duration !== '--' && (
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="w-3 h-3" />
                            {workout.duration}
                          </span>
                        )}
                        {workout.setCount > 0 && (
                          <span className="text-xs text-zinc-500">
                            {workout.setCount} {language === 'bn' ? 'সেট' : 'sets'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center px-4">
                      <span className="text-xs font-medium text-zinc-500">{workout.date}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

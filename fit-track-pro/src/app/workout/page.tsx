import Link from 'next/link'
import { Plus, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function WorkoutHub() {
  return (
    <div className="flex flex-col min-h-screen bg-black p-6 pt-12 pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      <header className="space-y-1 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Workout</h1>
        <p className="text-zinc-400 text-sm">Start an empty session or pick a routine.</p>
      </header>

      {/* Quick Start */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
        <h2 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase mb-4">Quick Start</h2>
        <Link href="/workout/active" className="block">
          <Button className="w-full h-20 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] transition-all group">
            <Plus className="w-7 h-7 mr-2 group-hover:scale-110 transition-transform" />
            Start Empty Workout
          </Button>
        </Link>
      </section>

      {/* Routines Placeholder (To be implemented later if user wants saved routines) */}
      <section className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">My Routines</h2>
          <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400 h-8 px-2 text-xs">
            <Plus className="w-4 h-4 mr-1" /> New Routine
          </Button>
        </div>
        
        <div className="space-y-3">
          <Card className="bg-zinc-950/50 backdrop-blur-md border-white/5 border-dashed flex flex-col items-center justify-center p-8 text-center">
            <ClipboardList className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400 font-medium">No routines yet</p>
            <p className="text-xs text-zinc-600 mt-1">Create a routine to save time.</p>
          </Card>
        </div>
      </section>
    </div>
  )
}

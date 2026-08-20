import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Activity, Flame, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let displayName = "Athlete"
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      
    if (profile?.display_name) {
      // Get first name
      displayName = profile.display_name.split(' ')[0]
    }
  }

  // Mock data for UI presentation
  const recentWorkouts = [
    { id: 1, name: "Push Day", duration: "45 min", date: "Today" },
    { id: 2, name: "Pull Day", duration: "50 min", date: "Yesterday" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 overflow-x-hidden selection:bg-emerald-500/30">
      {/* Top Background Glow */}
      <div className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none" />
      
      <main className="flex-1 px-6 pt-12 space-y-8 z-10">
        
        {/* Header */}
        <header className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-sm font-semibold tracking-wider text-emerald-500 uppercase">
            Welcome back
          </h2>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Ready to crush it, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">{displayName}</span>?
          </h1>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-700 delay-100 fill-mode-both">
          <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 shadow-lg">
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-950/50 backdrop-blur-md border-white/10 shadow-lg">
            <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
              <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Workouts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Button */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
          <Link href="/workout" className="block">
            <Button className="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center">
                <Plus className="w-6 h-6 mr-2" />
                Start Empty Workout
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-200/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </Link>
        </div>

        {/* Recent Workouts */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <Link href="/progress" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-zinc-950/50 backdrop-blur-md border-white/10 overflow-hidden group hover:bg-zinc-900/50 transition-colors cursor-pointer">
                <CardContent className="p-0 flex items-center">
                  <div className="p-4 bg-emerald-500/10 h-full flex items-center justify-center border-r border-white/5">
                    <Dumbbell className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{workout.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{workout.duration}</p>
                    </div>
                    <div className="text-xs font-medium text-zinc-500">
                      {workout.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

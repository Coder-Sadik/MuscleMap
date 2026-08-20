'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Flame, Dumbbell, Activity, Trophy, TrendingUp, Calendar as CalendarIcon } from 'lucide-react'

// Types based on our DB schema
type WorkoutLog = {
  id: string
  start_time: string
  exercises_data: any[]
}

type BodyMetric = {
  id: string
  recorded_date: string
  weight_kg: string
}

type Exercise = {
  id: string
  name: string
  primary_muscle: string
}

export default function ProgressPage() {
  const supabase = createClient()
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoaded(true)
        return
      }

      const [logRes, metricsRes, exRes] = await Promise.all([
        supabase.from('workout_logs').select('id, start_time, exercises_data').eq('user_id', user.id).order('start_time', { ascending: true }),
        supabase.from('body_metrics').select('id, recorded_date, weight_kg').eq('user_id', user.id).order('recorded_date', { ascending: true }),
        supabase.from('exercises').select('id, name, primary_muscle')
      ])

      if (logRes.data) setLogs(logRes.data)
      if (metricsRes.data) setMetrics(metricsRes.data)
      if (exRes.data) setExercises(exRes.data)
      
      setIsLoaded(true)
    }

    loadData()
  }, [supabase])

  // Process Data Memoized
  const stats = useMemo(() => {
    if (!isLoaded) return null

    // 1. Total Workouts
    const totalWorkouts = logs.length

    // 2. Streak Calculation (Consecutive Days or Same Day)
    let streak = 0
    if (logs.length > 0) {
      const dates = logs.map(l => new Date(l.start_time).toDateString())
      const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d))
      uniqueDates.sort((a, b) => b.getTime() - a.getTime()) // Descending

      const today = new Date()
      today.setHours(0,0,0,0)
      
      let currentDateToCompare = today
      
      // If the latest workout wasn't today or yesterday, streak is 0
      if (uniqueDates[0]) {
        const diffDays = Math.floor((today.getTime() - uniqueDates[0].getTime()) / (1000 * 3600 * 24))
        if (diffDays <= 1) {
          streak = 1
          currentDateToCompare = uniqueDates[0]
          
          for (let i = 1; i < uniqueDates.length; i++) {
            const diff = Math.floor((currentDateToCompare.getTime() - uniqueDates[i].getTime()) / (1000 * 3600 * 24))
            if (diff === 1) {
              streak++
              currentDateToCompare = uniqueDates[i]
            } else {
              break
            }
          }
        }
      }
    }

    // 3. Total Volume & PRs & Strength Timeline
    let totalVolume = 0
    const strengthData: { date: string, volume: number }[] = []
    const prs: Record<string, { weight: number, volume: number, name: string }> = {}
    
    // 4. Muscle Frequency
    const muscleCounts: Record<string, number> = {}
    const exMap = new Map(exercises.map(e => [e.id, e.primary_muscle]))

    logs.forEach(log => {
      let dailyVolume = 0
      
      if (Array.isArray(log.exercises_data)) {
        log.exercises_data.forEach((ex: any) => {
          // Muscle Count
          const muscle = exMap.get(ex.exercise_id) || 'Other'
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1

          // Volume & PRs
          let exVol = 0
          let maxW = 0
          if (Array.isArray(ex.sets)) {
            ex.sets.forEach((s: any) => {
              if (s.completed) {
                const w = parseFloat(s.weight) || 0
                const r = parseFloat(s.reps) || 0
                const vol = w * r
                dailyVolume += vol
                exVol += vol
                if (w > maxW) maxW = w
              }
            })
          }
          
          if (!prs[ex.name]) prs[ex.name] = { weight: 0, volume: 0, name: ex.name }
          if (maxW > prs[ex.name].weight) prs[ex.name].weight = maxW
          if (exVol > prs[ex.name].volume) prs[ex.name].volume = exVol
        })
      }
      
      totalVolume += dailyVolume
      strengthData.push({
        date: new Date(log.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        volume: dailyVolume
      })
    })

    const topPRs = Object.values(prs)
      .filter(pr => pr.volume > 0)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5)

    const muscleData = Object.entries(muscleCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const weightData = metrics.map(m => ({
      date: new Date(m.recorded_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: parseFloat(m.weight_kg)
    }))

    return {
      totalWorkouts,
      streak,
      totalVolume,
      strengthData,
      muscleData,
      weightData,
      topPRs
    }
  }, [isLoaded, logs, metrics, exercises])

  if (!isLoaded) {
    return (
      <div className="flex flex-col h-full bg-black items-center justify-center min-h-screen">
        <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  const hasData = logs.length > 0 || metrics.length > 0

  return (
    <div className="flex flex-col h-full p-4 md:p-6 pb-24 bg-black min-h-screen overflow-y-auto selection:bg-emerald-500/30 text-white animate-in fade-in duration-500">
      <header className="mb-8 mt-2">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
          <TrendingUp className="text-emerald-500 w-8 h-8" />
          Dashboard
        </h1>
        <p className="text-zinc-400 mt-1">Track your gains and performance over time.</p>
      </header>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-10 bg-zinc-900/50 rounded-3xl border border-white/5 text-center">
          <Dumbbell className="w-12 h-12 text-zinc-600 mb-4" />
          <h2 className="text-xl font-bold mb-2">No data yet!</h2>
          <p className="text-zinc-500 max-w-sm">Complete your first workout to start seeing your progress, volume, and streaks here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-5 rounded-3xl">
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Flame className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Streak</span>
              </div>
              <div className="text-4xl font-black text-white">{stats?.streak} <span className="text-lg text-zinc-500 font-normal">days</span></div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-5 rounded-3xl">
              <div className="flex items-center gap-2 text-emerald-500 mb-2">
                <Dumbbell className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Volume</span>
              </div>
              <div className="text-4xl font-black text-white">{stats?.totalVolume.toLocaleString()} <span className="text-lg text-zinc-500 font-normal">kg</span></div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-5 rounded-3xl col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <CalendarIcon className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Workouts</span>
              </div>
              <div className="text-4xl font-black text-white">{stats?.totalWorkouts}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Strength Progression Chart */}
            <div className="bg-zinc-900/50 border border-white/5 p-5 md:p-6 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-emerald-500 w-5 h-5" /> Strength (Volume / Workout)
              </h3>
              <div className="h-[250px] w-full">
                {stats?.strengthData && stats.strengthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.strengthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => \`\${val}k\`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="volume" name="Volume (kg)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">Not enough data</div>
                )}
              </div>
            </div>

            {/* Muscle Frequency Chart */}
            <div className="bg-zinc-900/50 border border-white/5 p-5 md:p-6 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity className="text-blue-500 w-5 h-5" /> Muscle Group Frequency
              </h3>
              <div className="h-[250px] w-full">
                {stats?.muscleData && stats.muscleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.muscleData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={80} />
                      <Tooltip 
                        cursor={{fill: '#27272a'}}
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" name="Workouts" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">Not enough data</div>
                )}
              </div>
            </div>

            {/* Body Weight Chart */}
            <div className="bg-zinc-900/50 border border-white/5 p-5 md:p-6 rounded-3xl lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-purple-500 w-5 h-5" /> Body Weight Progression
              </h3>
              <div className="h-[250px] w-full">
                {stats?.weightData && stats.weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.weightData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                      <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#000'}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500">No body weight records yet. Add them in Profile.</div>
                )}
              </div>
            </div>
            
            {/* Personal Records */}
            <div className="bg-zinc-900/50 border border-white/5 p-5 md:p-6 rounded-3xl lg:col-span-2">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" /> All-Time Personal Records
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stats?.topPRs && stats.topPRs.length > 0 ? (
                  stats.topPRs.map((pr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="font-bold text-zinc-200 truncate pr-4">{pr.name}</div>
                      <div className="text-right shrink-0">
                        <div className="text-yellow-500 font-black">{pr.weight} kg <span className="text-xs text-yellow-500/70 font-normal">Max</span></div>
                        <div className="text-xs text-zinc-500">{pr.volume.toLocaleString()} kg Vol</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 col-span-2 py-4">No records found. Keep lifting!</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

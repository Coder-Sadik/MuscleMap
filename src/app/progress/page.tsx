'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Flame, Dumbbell, Activity, Trophy, TrendingUp,
  Calendar as CalendarIcon, ArrowUp, ArrowDown, Minus
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { computeStreak } from '@/lib/utils'

// --- Types ---
type WorkoutLog = { id: string; start_time: string; exercises_data: any[] }
type BodyMetric = { id: string; recorded_date: string; weight_kg: string }
type Exercise = { id: string; name: string; primary_muscle: string }
type TimeFilter = 'all' | '3m' | '1m'

const RANK_BADGES = ['🥇', '🥈', '🥉', '4th', '5th']

function getFilterCutoff(filter: TimeFilter): Date | null {
  if (filter === 'all') return null
  const d = new Date()
  if (filter === '3m') d.setMonth(d.getMonth() - 3)
  if (filter === '1m') d.setMonth(d.getMonth() - 1)
  return d
}

// --- Custom Tooltip ---
function CustomTooltip({ active, payload, label, color }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-zinc-400 text-xs mb-1">{label}</p>
      <p className="font-bold text-white" style={{ color }}>
        {payload[0].value?.toLocaleString()}{' '}
        <span className="text-xs font-normal text-zinc-400">{payload[0].name}</span>
      </p>
    </div>
  )
}

export default function ProgressPage() {
  const [supabase] = useState(() => createClient())
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filter, setFilter] = useState<TimeFilter>('all')
  const { dict, language } = useLanguage()

  const timeFilters: { key: TimeFilter; label: string }[] = useMemo(() => [
    { key: 'all', label: dict.progress.allTime },
    { key: '3m', label: language === 'bn' ? '৩ মাস' : '3 Months' },
    { key: '1m', label: language === 'bn' ? '১ মাস' : '1 Month' },
  ], [dict, language])

  // --- Fetch Data ---
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [logsRes, metricsRes, exRes] = await Promise.all([
        supabase.from('workout_logs').select('id, start_time, exercises_data')
          .eq('user_id', user.id).order('start_time', { ascending: true }),
        supabase.from('body_metrics').select('id, recorded_date, weight_kg')
          .eq('user_id', user.id).order('recorded_date', { ascending: true }),
        supabase.from('exercises').select('id, name, primary_muscle'),
      ])

      if (logsRes.data) setLogs(logsRes.data)
      if (metricsRes.data) setMetrics(metricsRes.data)
      if (exRes.data) setExercises(exRes.data)
      setLoading(false)
    }
    loadData()
  }, [supabase])

  // --- Computed Analytics ---
  const stats = useMemo(() => {
    if (logs.length === 0 && metrics.length === 0) return null

    const cutoff = getFilterCutoff(filter)
    const filteredLogs = cutoff
      ? logs.filter(l => new Date(l.start_time) >= cutoff)
      : logs

    const exMap = new Map(exercises.map(e => [e.id, e.primary_muscle]))

    let totalVolume = 0
    const strengthData: { date: string; volume: number }[] = []
    const prs: Record<string, { weight: number; volume: number; name: string }> = {}
    const muscleCounts: Record<string, number> = {}

    filteredLogs.forEach(log => {
      let dailyVolume = 0
      if (Array.isArray(log.exercises_data)) {
        log.exercises_data.forEach((ex: any) => {
          const muscle = exMap.get(ex.exercise_id) || 'Other'
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1
          let exVol = 0, maxW = 0
          if (Array.isArray(ex.sets)) {
            ex.sets.forEach((s: any) => {
              if (s.completed) {
                const w = parseFloat(s.weight) || 0
                const r = parseFloat(s.reps) || 0
                const vol = w * r
                dailyVolume += vol; exVol += vol
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
        date: new Date(log.start_time).toLocaleDateString(language === 'bn' ? 'bn-BD' : undefined, { month: 'short', day: 'numeric' }),
        volume: Math.round(dailyVolume),
      })
    })

    const topPRs = Object.values(prs).filter(pr => pr.volume > 0)
      .sort((a, b) => b.volume - a.volume).slice(0, 5)

    const muscleData = Object.entries(muscleCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const filteredMetrics = cutoff
      ? metrics.filter(m => new Date(m.recorded_date) >= cutoff)
      : metrics
    const weightData = filteredMetrics.map(m => ({
      date: new Date(m.recorded_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : undefined, { month: 'short', day: 'numeric' }),
      weight: parseFloat(m.weight_kg)
    }))

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0)
    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfWeek.getDate() - 7)

    const thisWeekLogs = logs.filter(l => new Date(l.start_time) >= startOfWeek)
    const lastWeekLogs = logs.filter(l => {
      const d = new Date(l.start_time)
      return d >= startOfLastWeek && d < startOfWeek
    })

    const calcVol = (arr: WorkoutLog[]) => arr.reduce((acc, l) => {
      if (!Array.isArray(l.exercises_data)) return acc
      return acc + l.exercises_data.reduce((eAcc: number, ex: any) => {
        if (!Array.isArray(ex.sets)) return eAcc
        return eAcc + ex.sets.reduce((sAcc: number, s: any) =>
          s.completed ? sAcc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0) : sAcc, 0)
      }, 0)
    }, 0)

    const thisWeekVol = calcVol(thisWeekLogs)
    const lastWeekVol = calcVol(lastWeekLogs)
    const volDiff = thisWeekVol - lastWeekVol
    const volPct = lastWeekVol > 0 ? Math.round((volDiff / lastWeekVol) * 100) : null

    // --- Volume trend: avg last 4 vs prev 4 ---
    let volumeTrend: number | null = null
    if (strengthData.length >= 4) {
      const last4avg = strengthData.slice(-4).reduce((s, d) => s + d.volume, 0) / 4
      const prev4 = strengthData.slice(-8, -4)
      if (prev4.length > 0) {
        const prev4avg = prev4.reduce((s, d) => s + d.volume, 0) / prev4.length
        volumeTrend = prev4avg > 0 ? Math.round(((last4avg - prev4avg) / prev4avg) * 100) : null
      }
    }

    const streak = computeStreak(logs)

    return {
      totalVolume,
      totalWorkouts: filteredLogs.length,
      strengthData,
      weightData,
      muscleData,
      topPRs,
      thisWeekCount: thisWeekLogs.length,
      lastWeekCount: lastWeekLogs.length,
      thisWeekVol,
      volDiff,
      volPct,
      volumeTrend,
      streak,
    }
  }, [logs, metrics, exercises, filter, language])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-zinc-500 text-sm">{dict.common.loading}</p>
        </div>
      </div>
    )
  }

  const hasData = logs.length > 0 || metrics.length > 0

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24 overflow-x-hidden selection:bg-emerald-500/30 text-white">

      <div className="fixed top-0 right-[-20%] w-[60%] h-[40%] rounded-full bg-emerald-500/8 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[20%] left-[-10%] w-[40%] h-[30%] rounded-full bg-blue-500/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 px-4 pt-10 pb-4 space-y-6 animate-in fade-in duration-500">

        <header className="px-2">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold tracking-widest text-emerald-500 uppercase">{dict.progress.title}</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            {language === 'bn' ? 'ড্যাশবোর্ড' : 'Your Dashboard'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">{dict.progress.subtitle}</p>
        </header>

        <div className="flex gap-2 px-2">
          {timeFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!hasData ? (
          <div className="mx-2 flex flex-col items-center justify-center p-10 bg-zinc-900/50 rounded-3xl border border-white/5 text-center">
            <Dumbbell className="w-12 h-12 text-zinc-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">{dict.progress.noData}</h2>
            <p className="text-zinc-500 max-w-sm text-sm">
              {language === 'bn' 
                ? 'আপনার অগ্রগতি, ভলিউম এবং স্ট্রিক দেখতে আপনার প্রথম ওয়ার্কআউট সম্পন্ন করুন।'
                : 'Complete your first workout to start seeing your progress, volume, and streaks here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            <div className="grid grid-cols-3 gap-3 px-2">
              <div className="bg-zinc-900/60 border border-orange-500/20 p-4 rounded-3xl flex flex-col gap-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{dict.home.dayStreak}</span>
                </div>
                <div>
                  <div className="text-3xl font-black text-white leading-none">{stats?.streak}</div>
                  <div className="text-xs text-zinc-500 mt-1">{language === 'bn' ? 'দিন' : 'days'}</div>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-emerald-500/20 p-4 rounded-3xl flex flex-col gap-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Dumbbell className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{dict.progress.totalVolume}</span>
                </div>
                <div>
                  <div className="text-3xl font-black text-white leading-none">
                    {stats?.totalVolume && stats.totalVolume >= 1000
                      ? `${(stats.totalVolume / 1000).toFixed(1)}k`
                      : stats?.totalVolume ?? 0}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{dict.common.kg}</div>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-blue-500/20 p-4 rounded-3xl flex flex-col gap-3 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{dict.progress.totalWorkouts}</span>
                </div>
                <div>
                  <div className="text-3xl font-black text-white leading-none">{stats?.totalWorkouts}</div>
                  <div className="text-xs text-zinc-500 mt-1">{language === 'bn' ? 'সেশন' : 'sessions'}</div>
                </div>
              </div>
            </div>

            <div className="mx-2 bg-zinc-900/60 border border-white/5 p-4 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-semibold text-zinc-300">Weekly Activity</span>
                </div>
                {(() => {
                  const tw = stats?.thisWeekCount ?? 0
                  const lw = stats?.lastWeekCount ?? 0
                  const diff = tw - lw
                  if (diff > 0) return (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <ArrowUp className="w-3 h-3" /> +{diff} vs last week
                    </span>
                  )
                  if (diff < 0) return (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                      <ArrowDown className="w-3 h-3" /> {diff} vs last week
                    </span>
                  )
                  return (
                    <span className="flex items-center gap-1 text-xs font-bold text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                      <Minus className="w-3 h-3" /> Same as last week
                    </span>
                  )
                })()}
              </div>
              <div className="flex gap-6 mt-3">
                <div>
                  <div className="text-2xl font-black text-white">{stats?.thisWeekCount}</div>
                  <div className="text-xs text-zinc-500">This week</div>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <div className="text-2xl font-black text-zinc-400">{stats?.lastWeekCount}</div>
                  <div className="text-xs text-zinc-500">Last week</div>
                </div>
              </div>
            </div>

            {/* ── Volume Chart ── */}
            <div className="mx-2 bg-zinc-900/60 border border-white/5 p-5 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="text-emerald-500 w-4 h-4" />
                  Volume per Workout
                </h3>
                {stats?.volumeTrend !== null && stats?.volumeTrend !== undefined && (
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                    stats.volumeTrend >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400 bg-red-500/10'
                  }`}>
                    {stats.volumeTrend >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(stats.volumeTrend)}% vs prev 4
                  </span>
                )}
              </div>
              <div className="h-[220px]">
                {stats?.strengthData && stats.strengthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.strengthData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false}
                        tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : `${v}`} />
                      <Tooltip content={<CustomTooltip color="#10b981" />} />
                      <Area type="monotone" dataKey="volume" name="kg" stroke="#10b981" strokeWidth={2.5}
                        fillOpacity={1} fill="url(#volGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#000', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-sm">Not enough data</div>
                )}
              </div>
            </div>

            {/* ── Muscle Frequency ── */}
            <div className="mx-2 bg-zinc-900/60 border border-white/5 p-5 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                <Activity className="text-blue-400 w-4 h-4" />
                Muscle Group Frequency
              </h3>
              <div className="h-[240px]">
                {stats?.muscleData && stats.muscleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.muscleData} layout="vertical" margin={{ top: 0, right: 10, left: 16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} vertical={true} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} width={72} />
                      <Tooltip content={<CustomTooltip color="#3b82f6" />} />
                      <Bar dataKey="count" name="sessions" fill="url(#barGrad)" radius={[0, 6, 6, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-sm">Not enough data</div>
                )}
              </div>
            </div>

            {/* ── Body Weight ── */}
            <div className="mx-2 bg-zinc-900/60 border border-white/5 p-5 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                <TrendingUp className="text-purple-400 w-4 h-4" />
                Body Weight Progression
              </h3>
              <div className="h-[200px]">
                {stats?.weightData && stats.weightData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.weightData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip content={<CustomTooltip color="#a855f7" />} />
                      <Line type="monotone" dataKey="weight" name="kg" stroke="#a855f7" strokeWidth={2.5}
                        dot={{ r: 4, fill: '#a855f7', stroke: '#000', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                    No body weight records yet — add them in Profile.
                  </div>
                )}
              </div>
            </div>

            {/* ── Personal Records ── */}
            <div className="mx-2 bg-zinc-900/60 border border-white/5 p-5 rounded-3xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
              <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                <Trophy className="text-yellow-400 w-4 h-4" />
                All-Time Personal Records
              </h3>
              <div className="space-y-3">
                {stats?.topPRs && stats.topPRs.length > 0 ? (
                  stats.topPRs.map((pr, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      {/* Rank badge */}
                      <div className="text-xl shrink-0 w-8 text-center">
                        {idx < 3 ? RANK_BADGES[idx] : (
                          <span className="text-xs font-bold text-zinc-600 bg-zinc-800 rounded-full px-1.5 py-0.5">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-zinc-200 truncate">{pr.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{pr.volume.toLocaleString()} kg total volume</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-yellow-400">{pr.weight} <span className="text-xs font-normal text-yellow-500/60">kg</span></div>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider">max lift</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-500 text-sm py-4 text-center">No records found. Keep lifting! 🏋️</div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

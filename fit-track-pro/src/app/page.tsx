import { createClient } from '@/lib/supabase/server'
import { getRelativeDate, getDuration, computeStreak, getExerciseNames } from '@/lib/utils'
import HomeDashboardView from './HomeDashboardView'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let displayName = 'Athlete'
  let recentWorkouts: {
    id: string
    exerciseNames: string
    duration: string
    date: string
    setCount: number
  }[] = []
  let totalWorkouts = 0
  let streak = 0
  let suggestedRoutine: {
    id: string
    name: string
    exercises: {
      exercise_id: string
      name: string
      target_sets: number
      target_reps: number
      target_weight_kg: number
    }[]
  } | null = null

  if (user) {
    const [profileRes, recentRes, allLogsRes, routinesRes] = await Promise.all([
      supabase.from('profiles').select('display_name').eq('id', user.id).single(),
      supabase
        .from('workout_logs')
        .select('id, start_time, end_time, exercises_data')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(3),
      supabase
        .from('workout_logs')
        .select('id, start_time')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false }),
      supabase
        .from('workout_routines')
        .select(`
          id,
          name,
          routine_exercises (
            exercise_id,
            target_sets,
            target_reps,
            target_weight_kg,
            exercises ( name )
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single(),
    ])

    if (profileRes.data?.display_name) {
      displayName = profileRes.data.display_name.split(' ')[0]
    }

    if (recentRes.data) {
      recentWorkouts = recentRes.data.map((log) => {
        const exData = Array.isArray(log.exercises_data) ? log.exercises_data : []
        const totalSets = exData.reduce((sum: number, ex: { sets?: { completed: boolean }[] }) =>
          sum + (Array.isArray(ex.sets) ? ex.sets.filter((s: { completed: boolean }) => s.completed).length : 0), 0)
        return {
          id: log.id,
          exerciseNames: getExerciseNames(exData),
          duration: getDuration(log.start_time, log.end_time),
          date: getRelativeDate(log.start_time),
          setCount: totalSets,
        }
      })
    }

    if (allLogsRes.data) {
      totalWorkouts = allLogsRes.data.length
      streak = computeStreak(allLogsRes.data)
    }

    if (routinesRes.data) {
      const r = routinesRes.data as {
        id: string
        name: string
        routine_exercises?: {
          exercise_id: string
          target_sets: number
          target_reps: number
          target_weight_kg: number
          exercises?: { name?: string }
        }[]
      }
      suggestedRoutine = {
        id: r.id,
        name: r.name,
        exercises: (r.routine_exercises ?? []).map((re) => ({
          exercise_id: re.exercise_id,
          name: re.exercises?.name ?? 'Unknown',
          target_sets: re.target_sets,
          target_reps: re.target_reps,
          target_weight_kg: re.target_weight_kg,
        })),
      }
    }
  }

  return (
    <HomeDashboardView
      displayName={displayName}
      streak={streak}
      totalWorkouts={totalWorkouts}
      suggestedRoutine={suggestedRoutine}
      recentWorkouts={recentWorkouts}
    />
  )
}

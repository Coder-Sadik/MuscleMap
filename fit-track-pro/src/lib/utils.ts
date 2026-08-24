import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date & Time Utilities ───────────────────────────────────────────────────

/**
 * Returns a human-readable relative date string (e.g. "Today", "Yesterday", "3d ago").
 * Compares calendar dates in local time to avoid timezone drift.
 */
export function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const diffDays = Math.round((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

/** Formats a workout duration from ISO start/end timestamps. */
export function getDuration(start: string, end: string | null): string {
  if (!end) return '--'
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.round(diffMs / (1000 * 60))
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/**
 * Formats elapsed seconds as MM:SS or H:MM:SS.
 * Used in the active workout timer display.
 */
export function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parses a date-only string (e.g. "2025-01-15") as a **local** date
 * to avoid the UTC-midnight timezone shift that `new Date(str)` causes.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// ─── Workout Data Utilities ──────────────────────────────────────────────────

/**
 * Computes the current workout streak from an array of log objects.
 * A streak continues if consecutive unique days differ by exactly 1.
 * A streak of 0 is returned if the most recent workout was >1 day ago.
 */
export function computeStreak(logs: { start_time: string }[]): number {
  if (logs.length === 0) return 0
  const dates = logs.map(l => new Date(l.start_time).toDateString())
  const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d))
  uniqueDates.sort((a, b) => b.getTime() - a.getTime())
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffToLatest = Math.floor((today.getTime() - uniqueDates[0].getTime()) / (1000 * 3600 * 24))
  if (diffToLatest > 1) return 0
  let streak = 1
  let cur = uniqueDates[0]
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = Math.floor((cur.getTime() - uniqueDates[i].getTime()) / (1000 * 3600 * 24))
    if (diff === 1) { streak++; cur = uniqueDates[i] } else break
  }
  return streak
}

/** Returns a comma-joined preview of the first 3 exercise names in a workout log. */
export function getExerciseNames(exercisesData: { name?: string }[]): string {
  if (!Array.isArray(exercisesData) || exercisesData.length === 0) return 'No exercises logged'
  const names = exercisesData.map(ex => ex.name).filter(Boolean).slice(0, 3)
  const rest = exercisesData.length - 3
  return names.join(', ') + (rest > 0 ? ` +${rest} more` : '')
}

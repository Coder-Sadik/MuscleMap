'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Scale, Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { parseLocalDate } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/LanguageContext'

type BodyMetric = {
  id: string
  recorded_date: string
  weight_kg: string
  body_fat_percentage: string | null
}

export function BodyMetrics() {
  // B14: stabilise supabase client — createClient() is called once.
  const supabase = useState(() => createClient())[0]
  const { dict, language } = useLanguage()

  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState<string | null>(null)

  // B8 fix: stabilise `load` with useCallback
  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setIsLoading(false); return }

    const { data, error: fetchError } = await supabase
      .from('body_metrics')
      .select('id, recorded_date, weight_kg, body_fat_percentage')
      .eq('user_id', user.id)
      .order('recorded_date', { ascending: false })
      .limit(10)

    if (fetchError) {
      console.error('Failed to load body metrics:', fetchError)
    } else if (data) {
      setMetrics(data)
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  async function handleSave() {
    if (!weight || isNaN(parseFloat(weight))) {
      setError(language === 'bn' ? 'সঠিক ওজন লিখুন।' : 'Please enter a valid weight.')
      return
    }
    setIsSaving(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setIsSaving(false); return }

    const { error: err } = await supabase.from('body_metrics').insert({
      user_id: user.id,
      weight_kg: parseFloat(weight),
      body_fat_percentage: bodyFat ? parseFloat(bodyFat) : null,
      recorded_date: date,
    })

    if (err) {
      setError(err.message)
    } else {
      setWeight('')
      setBodyFat('')
      setDate(new Date().toISOString().split('T')[0])
      setShowForm(false)
      toast.success(dict.profile.entryLogged)
      await load()
    }
    setIsSaving(false)
  }

  // B7 fix: handle delete errors properly with optimistic rollback
  async function handleDelete(id: string) {
    const previous = metrics
    setMetrics(prev => prev.filter(m => m.id !== id))

    const { error: deleteError } = await supabase
      .from('body_metrics')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setMetrics(previous)
      toast.error(language === 'bn' ? 'এন্ট্রি মুছতে ব্যর্থ হয়েছে।' : 'Failed to delete entry. Please try again.')
    }
  }

  // Compute trend vs previous entry
  const latest = metrics[0]
  const previous = metrics[1]
  const trend = latest && previous
    ? parseFloat(latest.weight_kg) - parseFloat(previous.weight_kg)
    : null

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/15">
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-white">{dict.profile.bodyWeight}</h2>
            <p className="text-xs text-zinc-500">{dict.profile.trackWeightSub}</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setError(null) }}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-full transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          {dict.profile.logEntry}
        </button>
      </div>

      {/* Current weight + trend */}
      {latest && (
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="text-4xl font-black text-white">
              {parseFloat(latest.weight_kg).toFixed(1)}
              <span className="text-lg text-zinc-500 font-normal ml-1">{dict.common.kg}</span>
            </div>
            {/* B24 fix: parse as local date */}
            <div className="text-xs text-zinc-500 mt-0.5">
              {parseLocalDate(latest.recorded_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : undefined, {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </div>
          </div>
          {trend !== null && (
            <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${
              trend < 0
                ? 'text-emerald-400 bg-emerald-500/10'
                : trend > 0
                ? 'text-red-400 bg-red-500/10'
                : 'text-zinc-400 bg-zinc-800'
            }`}>
              {trend < 0
                ? <TrendingDown className="w-4 h-4" />
                : trend > 0
                ? <TrendingUp className="w-4 h-4" />
                : <Minus className="w-4 h-4" />}
              {trend > 0 ? '+' : ''}{trend.toFixed(1)} {dict.common.kg}
            </div>
          )}
        </div>
      )}

      {/* Log form */}
      {showForm && (
        <div className="bg-black/30 rounded-2xl p-4 space-y-3 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1 block">{dict.profile.weightKg} *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 75.5"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-medium mb-1 block">{dict.profile.bodyFat}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="e.g. 18.5"
                value={bodyFat}
                onChange={e => setBodyFat(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-1 block">{dict.profile.date}</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold h-10"
            >
              {isSaving ? (language === 'bn' ? 'সংরক্ষণ হচ্ছে…' : 'Saving…') : dict.profile.saveEntry}
            </Button>
            <Button
              variant="ghost"
              onClick={() => { setShowForm(false); setError(null) }}
              className="rounded-xl h-10 text-zinc-400 hover:text-white"
            >
              {dict.profile.cancel}
            </Button>
          </div>
        </div>
      )}

      {/* History list */}
      {isLoading ? (
        <div className="text-zinc-600 text-sm text-center py-4">{dict.common.loading}</div>
      ) : metrics.length === 0 ? (
        <div className="text-zinc-600 text-sm text-center py-6">
          {language === 'bn' ? 'এখনও কোনো এন্ট্রি নেই। উপরে আপনার প্রথম ওজন যোগ করুন! 💪' : 'No entries yet. Log your first weight above! 💪'}
        </div>
      ) : (
        <div className="space-y-2">
          {metrics.map((m, idx) => (
            <div
              key={m.id}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors group ${
                idx === 0
                  ? 'bg-purple-500/10 border-purple-500/20'
                  : 'bg-black/20 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {idx === 0 && (
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">{dict.profile.latest}</span>
                )}
                <div>
                  <span className="font-bold text-white">
                    {parseFloat(m.weight_kg).toFixed(1)} {dict.common.kg}
                  </span>
                  {m.body_fat_percentage && (
                    <span className="text-zinc-500 text-xs ml-2">
                      {parseFloat(m.body_fat_percentage).toFixed(1)}% {dict.profile.fat}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">
                  {parseLocalDate(m.recorded_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : undefined, {
                    month: 'short', day: 'numeric',
                  })}
                </span>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                  aria-label={dict.profile.deleteEntry}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

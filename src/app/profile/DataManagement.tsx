'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Download, Upload, AlertCircle, CheckCircle2, FileText, Loader2, Database, Trophy } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext'

// CSV Parser Helper
function parseCSV(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  if (lines.length === 0) return { headers: [], rows: [] }
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }
  
  return { headers, rows }
}

function generateCSV(headers: string[], rows: any[]) {
  const headerRow = headers.join(',')
  const dataRows = rows.map(row =>
    headers.map(h => {
      const val = row[h]
      // B6 fix: guard against undefined/null values before calling string methods
      if (val == null) return ''
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    }).join(',')
  )
  return [headerRow, ...dataRows].join('\n')
}

export function DataManagement() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { language } = useLanguage()
  
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [previewData, setPreviewData] = useState<{ headers: string[], rows: any[] } | null>(null)
  const [importStatus, setImportStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null)

  // --- Export Logic ---
  const handleExport = async (type: 'history' | 'stats' | 'prs') => {
    setIsExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (type === 'history') {
        const { data, error } = await supabase
          .from('workout_logs')
          .select('id, start_time, end_time, notes, exercises_data')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })

        if (error) throw error

        const flatRows: any[] = []
        data?.forEach((log: any) => {
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((set: any, sIdx: number) => {
                  flatRows.push({
                    log_id: log.id,
                    start_time: log.start_time,
                    end_time: log.end_time || '',
                    exercise_name: ex.name,
                    set_number: sIdx + 1,
                    weight_kg: set.weight,
                    reps: set.reps,
                    completed: set.completed,
                    notes: log.notes || ''
                  })
                })
              }
            })
          }
        })

        const csv = generateCSV(['log_id', 'start_time', 'end_time', 'exercise_name', 'set_number', 'weight_kg', 'reps', 'completed', 'notes'], flatRows)
        downloadFile(csv, `workout-history-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      } else if (type === 'stats') {
        const { data, error } = await supabase
          .from('workout_logs')
          .select('id, start_time, exercises_data')
          .eq('user_id', user.id)

        if (error) throw error

        const totalWorkouts = data?.length || 0
        let totalVolume = 0
        
        data?.forEach((log: any) => {
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((set: any) => {
                  if (set.completed) {
                    totalVolume += (parseFloat(set.weight) || 0) * (parseFloat(set.reps) || 0)
                  }
                })
              }
            })
          }
        })

        const summaryRows = [
          { metric: 'Total Workouts', value: totalWorkouts },
          { metric: 'Total Volume (kg)', value: totalVolume },
          { metric: 'Generated Date', value: new Date().toISOString() }
        ]

        const csv = generateCSV(['metric', 'value'], summaryRows)
        downloadFile(csv, `workout-stats-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      } else if (type === 'prs') {
        const { data, error } = await supabase
          .from('workout_logs')
          .select('exercises_data')
          .eq('user_id', user.id)

        if (error) throw error

        const maxWeights: Record<string, number> = {}
        const maxVolumes: Record<string, number> = {}

        data?.forEach((log: any) => {
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((set: any) => {
                  if (set.completed) {
                    const w = parseFloat(set.weight) || 0
                    const r = parseFloat(set.reps) || 0
                    const v = w * r

                    if (!maxWeights[ex.name] || w > maxWeights[ex.name]) maxWeights[ex.name] = w
                    if (!maxVolumes[ex.name] || v > maxVolumes[ex.name]) maxVolumes[ex.name] = v
                  }
                })
              }
            })
          }
        })

        const prRows = Object.keys(maxWeights).map(name => ({
          exercise_name: name,
          max_weight_kg: maxWeights[name],
          max_single_set_volume: maxVolumes[name]
        }))

        const csv = generateCSV(['exercise_name', 'max_weight_kg', 'max_single_set_volume'], prRows)
        downloadFile(csv, `personal-records-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      setIsExporting(false)
    }
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // --- Import Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportStatus(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseCSV(text)
        
        const required = ['day', 'exercise', 'sets', 'reps']
        const hasRequired = required.every(r => parsed.headers.includes(r))
        
        if (!hasRequired) {
          setImportStatus({
            type: 'error',
            msg: language === 'bn' 
              ? `সিএসভি ফাইলে অবশ্যই কলাম থাকতে হবে: ${required.join(', ')}`
              : `CSV is missing required headers: ${required.join(', ')}`
          })
          setPreviewData(null)
          return
        }

        if (parsed.rows.length === 0) {
          setImportStatus({ 
            type: 'error', 
            msg: language === 'bn' ? "সিএসভি ফাইলে কোনো ডেটা পাওয়া যায়নি।" : "CSV file contains no data rows." 
          })
          setPreviewData(null)
          return
        }

        setPreviewData(parsed)
      } catch (err: any) {
        setImportStatus({ 
          type: 'error', 
          msg: language === 'bn' ? "সিএসভি পার্স করতে ত্রুটি হয়েছে।" : "Failed to parse CSV file: " + err.message 
        })
      }
    }
    reader.readAsText(file)
  }

  const confirmImport = async () => {
    if (!previewData) return
    setIsImporting(true)
    setImportStatus(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const routinesByDay: Record<string, any[]> = {}
      
      for (const row of previewData.rows) {
        const day = row['day'] || 'Imported Routine'
        if (!routinesByDay[day]) routinesByDay[day] = []
        routinesByDay[day].push(row)
      }

      for (const [dayName, exercises] of Object.entries(routinesByDay)) {
        const { data: routineData, error: routineError } = await supabase
          .from('workout_routines')
          .insert({
            user_id: user.id,
            name: dayName,
            notes: 'Imported via CSV'
          })
          .select('id')
          .single()

        if (routineError) throw routineError
        const routineId = routineData.id

        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i]
          const exName = ex['exercise']
          if (!exName) continue
          
          const { data: exData } = await supabase.from('exercises')
            .select('id').ilike('name', exName).limit(1)

          let exerciseId = exData?.[0]?.id
          
          if (!exerciseId) {
            const { data: newEx, error: newExError } = await supabase
              .from('exercises')
              .insert({
                user_id: user.id,
                name: exName,
                primary_muscle: 'Full Body'
              })
              .select('id')
              .single()
              
            if (!newExError && newEx) {
              exerciseId = newEx.id
            } else {
              continue
            }
          }

          const sets = parseInt(ex['sets']) || 3
          const reps = parseInt(ex['reps']) || 10
          const weight = parseFloat(ex['weight']) || null
          const rest = parseInt(ex['rest_seconds']) || 60

          await supabase.from('routine_exercises').insert({
            routine_id: routineId,
            exercise_id: exerciseId,
            order_index: i,
            target_sets: sets,
            target_reps: reps,
            target_weight_kg: weight,
            rest_seconds: rest
          })
        }
      }
      
      setImportStatus({ 
        type: 'success', 
        msg: language === 'bn' ? "রুটিনসমূহ সফলভাবে ইম্পোর্ট করা হয়েছে!" : "Successfully imported your routines!" 
      })
      setPreviewData(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
    } catch (e: any) {
      setImportStatus({ type: 'error', msg: e.message })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      {/* Export Section */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-emerald-500" />
          {language === 'bn' ? 'ডেটা এক্সপোর্ট করুন' : 'Export Data'}
        </h3>
        <p className="text-zinc-400 mb-6 text-sm">
          {language === 'bn'
            ? 'সিএসভি ফরম্যাটে আপনার ওয়ার্কআউট ইতিহাস, পরিসংখ্যান এবং রেকর্ড ডাউনলোড করুন।'
            : 'Download your workout history, calculated stats, and personal records in CSV format.'}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => handleExport('history')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <Database className="w-4 h-4 mr-2 text-blue-400" /> {language === 'bn' ? 'হিস্ট্রি এক্সপোর্ট' : 'Export History'}
          </Button>
          <Button onClick={() => handleExport('stats')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <FileText className="w-4 h-4 mr-2 text-purple-400" /> {language === 'bn' ? 'পরিসংখ্যান এক্সপোর্ট' : 'Export Stats'}
          </Button>
          <Button onClick={() => handleExport('prs')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <Trophy className="w-4 h-4 mr-2 text-yellow-400" /> {language === 'bn' ? 'পিআর এক্সপোর্ট' : 'Export PRs'}
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-500" />
          {language === 'bn' ? 'রুটিন ইম্পোর্ট করুন' : 'Import Routines'}
        </h3>
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          {language === 'bn' 
            ? 'স্বয়ংক্রিয়ভাবে ওয়ার্কআউট রুটিন তৈরি করতে একটি সিএসভি ফাইল আপলোড করুন।'
            : 'Upload a CSV file to automatically generate workout routines.'} <br/>
          {language === 'bn' ? 'প্রয়োজনীয় কলাম:' : 'Required columns:'} <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">day, exercise, sets, reps, weight, rest_seconds</code>
        </p>
        
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="sr-only">Choose CSV file</span>
            <input 
              type="file" 
              accept=".csv" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20 cursor-pointer focus:outline-none transition-colors"
            />
          </label>

          {importStatus && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${importStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
              {importStatus.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-medium">{importStatus.msg}</span>
            </div>
          )}

          {previewData && (
            <div className="mt-4 border border-white/10 rounded-2xl overflow-hidden bg-black/50 shadow-inner">
              <div className="p-4 bg-zinc-800/50 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Previewing {previewData.rows.length} rows</span>
                <Button onClick={confirmImport} disabled={isImporting} className="h-9 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl px-5 shadow-lg shadow-emerald-500/20">
                  {isImporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isImporting ? "Importing..." : "Confirm Import"}
                </Button>
              </div>
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm text-left text-zinc-400">
                  <thead className="text-xs uppercase bg-zinc-900 text-zinc-300 sticky top-0 border-b border-white/10 shadow-sm">
                    <tr>
                      {previewData.headers.map((h, i) => <th key={i} className="px-6 py-4 font-bold tracking-wider">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {previewData.rows.slice(0, 50).map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        {previewData.headers.map((h, j) => (
                          <td key={j} className="px-6 py-3 truncate max-w-[150px]">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                    {previewData.rows.length > 50 && (
                      <tr><td colSpan={previewData.headers.length} className="text-center py-4 text-zinc-500 italic">...and {previewData.rows.length - 50} more rows</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

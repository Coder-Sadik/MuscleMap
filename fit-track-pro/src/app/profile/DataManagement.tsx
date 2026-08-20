'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Download, Upload, AlertCircle, CheckCircle2, FileText, Loader2, Database, Trophy } from 'lucide-react'

// CSV Parser Helper
function parseCSV(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  if (lines.length === 0) return []
  
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
      // Escape commas and quotes
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

      const { data: logs } = await supabase.from('workout_logs').select('*').eq('user_id', user.id).order('start_time', { ascending: true })
      if (!logs || logs.length === 0) {
        alert("No workout logs found to export.")
        return
      }

      let csvContent = ""
      let filename = ""

      if (type === 'history') {
        const headers = ['Date', 'Exercise', 'Set Number', 'Reps', 'Weight']
        const rows: any[] = []
        logs.forEach(log => {
          const date = new Date(log.start_time).toLocaleDateString()
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((set: any, i: number) => {
                  if (set.completed) {
                    rows.push({ Date: date, Exercise: ex.name, 'Set Number': i + 1, Reps: set.reps, Weight: set.weight })
                  }
                })
              }
            })
          }
        })
        csvContent = generateCSV(headers, rows)
        filename = "workout_history.csv"
      } 
      
      else if (type === 'stats') {
        const headers = ['Date', 'Total Volume (kg)', 'Total Sets', 'Primary Muscles']
        const { data: exercises } = await supabase.from('exercises').select('id, primary_muscle')
        const exMap = new Map((exercises || []).map(e => [e.id, e.primary_muscle]))
        
        const rows: any[] = []
        logs.forEach(log => {
          const date = new Date(log.start_time).toLocaleDateString()
          let volume = 0
          let sets = 0
          const muscles = new Set<string>()
          
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              muscles.add(exMap.get(ex.exercise_id) || 'Other')
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((s: any) => {
                  if (s.completed) {
                    sets++
                    volume += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0)
                  }
                })
              }
            })
          }
          rows.push({ Date: date, 'Total Volume (kg)': volume, 'Total Sets': sets, 'Primary Muscles': Array.from(muscles).join('; ') })
        })
        csvContent = generateCSV(headers, rows)
        filename = "workout_stats.csv"
      }
      
      else if (type === 'prs') {
        const headers = ['Exercise', 'Max Weight (kg)', 'Max Volume (kg)']
        const prs: Record<string, { weight: number, volume: number }> = {}
        
        logs.forEach(log => {
          if (Array.isArray(log.exercises_data)) {
            log.exercises_data.forEach((ex: any) => {
              let exVol = 0
              let maxW = 0
              if (Array.isArray(ex.sets)) {
                ex.sets.forEach((s: any) => {
                  if (s.completed) {
                    const w = parseFloat(s.weight) || 0
                    const r = parseFloat(s.reps) || 0
                    if (w > maxW) maxW = w
                    exVol += w * r
                  }
                })
              }
              if (!prs[ex.name]) prs[ex.name] = { weight: 0, volume: 0 }
              if (maxW > prs[ex.name].weight) prs[ex.name].weight = maxW
              if (exVol > prs[ex.name].volume) prs[ex.name].volume = exVol
            })
          }
        })
        
        const rows = Object.entries(prs).map(([name, data]) => ({ Exercise: name, 'Max Weight (kg)': data.weight, 'Max Volume (kg)': data.volume }))
        csvContent = generateCSV(headers, rows)
        filename = "personal_records.csv"
      }

      // Download Trigger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (e: any) {
      alert("Export failed: " + e.message)
    } finally {
      setIsExporting(false)
    }
  }

  // --- Import Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImportStatus(null)
    setPreviewData(null)
    
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const { headers, rows } = parseCSV(text)
      
      // Validate Columns
      const required = ['day', 'exercise', 'sets', 'reps', 'weight', 'rest_seconds']
      const missing = required.filter(r => !headers.includes(r))
      
      if (missing.length > 0) {
        setImportStatus({ type: 'error', msg: `Missing required columns: ${missing.join(', ')}` })
        return
      }
      
      setPreviewData({ headers, rows })
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
      
      // We will group by 'day' to create Routine -> Routine Exercises
      const routinesMap: Record<string, any[]> = {}
      previewData.rows.forEach(row => {
        const day = row['day'] || 'Unknown Day'
        if (!routinesMap[day]) routinesMap[day] = []
        routinesMap[day].push(row)
      })

      for (const [day, rows] of Object.entries(routinesMap)) {
        // 1. Create or Find Routine
        const { data: existingRoutine } = await supabase.from('workout_routines')
          .select('id').eq('user_id', user.id).eq('name', day).single()
          
        let routineId = existingRoutine?.id
        
        if (!routineId) {
          const { data: newRoutine, error: rErr } = await supabase.from('workout_routines')
            .insert({ user_id: user.id, name: day, notes: 'Imported from CSV' })
            .select('id').single()
            
          if (rErr) throw new Error(`Failed to create routine '${day}': ${rErr.message}`)
          routineId = newRoutine.id
        }

        // 2. Add Exercises
        let orderIndex = 0
        for (const row of rows) {
          const exName = row['exercise']
          if (!exName) continue
          
          // Try to find exercise globally or for user
          let { data: exData } = await supabase.from('exercises')
            .select('id').ilike('name', exName).limit(1)
            
          let exerciseId = exData?.[0]?.id
          
          // Create custom exercise if not found
          if (!exerciseId) {
            const { data: newEx, error: exErr } = await supabase.from('exercises')
              .insert({ user_id: user.id, name: exName })
              .select('id').single()
              
            if (exErr) throw new Error(`Failed to create exercise '${exName}': ${exErr.message}`)
            exerciseId = newEx.id
          }

          // Insert into routine_exercises
          const sets = parseInt(row['sets']) || 3
          const reps = parseInt(row['reps']) || 10
          const rest = parseInt(row['rest_seconds']) || 60
          // "weight" column exists but our routine_exercises schema doesn't have it natively. 
          // We will omit it or we could add it to notes. The schema does not support target weight in routines currently.
          
          await supabase.from('routine_exercises').insert({
            routine_id: routineId,
            exercise_id: exerciseId,
            order_index: orderIndex++,
            target_sets: sets,
            target_reps: reps,
            rest_seconds: rest
          })
        }
      }
      
      setImportStatus({ type: 'success', msg: "Successfully imported your routines!" })
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
          Export Data
        </h3>
        <p className="text-zinc-400 mb-6 text-sm">Download your workout history, calculated stats, and personal records in CSV format.</p>
        
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => handleExport('history')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <Database className="w-4 h-4 mr-2 text-blue-400" /> Export History
          </Button>
          <Button onClick={() => handleExport('stats')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <FileText className="w-4 h-4 mr-2 text-purple-400" /> Export Stats
          </Button>
          <Button onClick={() => handleExport('prs')} disabled={isExporting} variant="outline" className="bg-zinc-800 border-white/10 hover:bg-zinc-700 text-white shadow-md">
            <Trophy className="w-4 h-4 mr-2 text-yellow-400" /> Export PRs
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-emerald-500" />
          Import Routines
        </h3>
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
          Upload a CSV file to automatically generate workout routines. <br/>
          Required columns: <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">day, exercise, sets, reps, weight, rest_seconds</code>
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

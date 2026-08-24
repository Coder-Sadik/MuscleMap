import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ExerciseDetailView from './ExerciseDetailView'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ExerciseDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: exercise } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()
    
  if (!exercise) {
    notFound()
  }

  return <ExerciseDetailView exercise={exercise} />
}

import ExerciseLibrary from './ExerciseLibrary'

export default function MusclesPage() {
  return (
    <div className="flex flex-col h-screen bg-black p-6 pt-12">
      <header className="space-y-1 mb-6 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Exercise Library</h1>
        <p className="text-zinc-400 text-sm">Browse 100+ exercises by muscle, equipment, or difficulty.</p>
      </header>
      
      <ExerciseLibrary />
    </div>
  );
}

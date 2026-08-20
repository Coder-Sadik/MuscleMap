export default function WorkoutPage() {
  return (
    <div className="flex flex-col h-full p-6 pt-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Workout</h1>
        <p className="text-muted-foreground">Log your sets and reps.</p>
      </header>
      
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
        <p className="text-muted-foreground text-sm">Workout content here</p>
      </div>
    </div>
  );
}

export type PredefinedPlan = {
  id: string
  name: string
  splitDays: number
  description: string
  routines: {
    name: string
    exercises: {
      name: string
      primary_muscle: string
      target_sets: number
      target_reps: number
      rest_seconds: number
    }[]
  }[]
}

export const PREDEFINED_PLANS: PredefinedPlan[] = [
  {
    id: 'ppl-3',
    name: 'Push / Pull / Legs (3 Day)',
    splitDays: 3,
    description: 'A classic 3-day split dividing workouts into pushing, pulling, and leg exercises.',
    routines: [
      {
        name: 'Day 1: Push',
        exercises: [
          { name: 'Barbell Bench Press', primary_muscle: 'Chest', target_sets: 3, target_reps: 8, rest_seconds: 90 },
          { name: 'Overhead Press', primary_muscle: 'Shoulders', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Incline Dumbbell Press', primary_muscle: 'Chest', target_sets: 3, target_reps: 10, rest_seconds: 60 },
          { name: 'Tricep Pushdowns', primary_muscle: 'Triceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 2: Pull',
        exercises: [
          { name: 'Pull-ups', primary_muscle: 'Back', target_sets: 3, target_reps: 8, rest_seconds: 90 },
          { name: 'Barbell Row', primary_muscle: 'Back', target_sets: 3, target_reps: 8, rest_seconds: 90 },
          { name: 'Lat Pulldown', primary_muscle: 'Back', target_sets: 3, target_reps: 10, rest_seconds: 60 },
          { name: 'Bicep Curls', primary_muscle: 'Biceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 3: Legs',
        exercises: [
          { name: 'Barbell Squat', primary_muscle: 'Legs', target_sets: 3, target_reps: 8, rest_seconds: 120 },
          { name: 'Leg Press', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Romanian Deadlift', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
        ]
      }
    ]
  },
  {
    id: 'upper-lower-4',
    name: 'Upper / Lower (4 Day)',
    splitDays: 4,
    description: 'A 4-day split alternating between upper body and lower body workouts.',
    routines: [
      {
        name: 'Day 1: Upper',
        exercises: [
          { name: 'Barbell Bench Press', primary_muscle: 'Chest', target_sets: 3, target_reps: 8, rest_seconds: 90 },
          { name: 'Pull-ups', primary_muscle: 'Back', target_sets: 3, target_reps: 8, rest_seconds: 90 },
          { name: 'Overhead Press', primary_muscle: 'Shoulders', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Barbell Row', primary_muscle: 'Back', target_sets: 3, target_reps: 10, rest_seconds: 90 },
        ]
      },
      {
        name: 'Day 2: Lower',
        exercises: [
          { name: 'Barbell Squat', primary_muscle: 'Legs', target_sets: 3, target_reps: 8, rest_seconds: 120 },
          { name: 'Romanian Deadlift', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Leg Press', primary_muscle: 'Legs', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 3: Upper',
        exercises: [
          { name: 'Incline Dumbbell Press', primary_muscle: 'Chest', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Lat Pulldown', primary_muscle: 'Back', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Lateral Raises', primary_muscle: 'Shoulders', target_sets: 3, target_reps: 12, rest_seconds: 60 },
          { name: 'Bicep Curls', primary_muscle: 'Biceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
          { name: 'Tricep Pushdowns', primary_muscle: 'Triceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 4: Lower',
        exercises: [
          { name: 'Romanian Deadlift', primary_muscle: 'Legs', target_sets: 3, target_reps: 5, rest_seconds: 120 },
          { name: 'Leg Press', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
        ]
      }
    ]
  },
  {
    id: 'bro-split-5',
    name: 'Bro Split (5 Day)',
    splitDays: 5,
    description: 'A 5-day split targeting one major muscle group per day.',
    routines: [
      {
        name: 'Day 1: Chest',
        exercises: [
          { name: 'Barbell Bench Press', primary_muscle: 'Chest', target_sets: 4, target_reps: 8, rest_seconds: 90 },
          { name: 'Incline Dumbbell Press', primary_muscle: 'Chest', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Push-ups', primary_muscle: 'Chest', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 2: Back',
        exercises: [
          { name: 'Pull-ups', primary_muscle: 'Back', target_sets: 4, target_reps: 8, rest_seconds: 90 },
          { name: 'Barbell Row', primary_muscle: 'Back', target_sets: 4, target_reps: 8, rest_seconds: 90 },
          { name: 'Lat Pulldown', primary_muscle: 'Back', target_sets: 3, target_reps: 10, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 3: Shoulders',
        exercises: [
          { name: 'Overhead Press', primary_muscle: 'Shoulders', target_sets: 4, target_reps: 8, rest_seconds: 90 },
          { name: 'Lateral Raises', primary_muscle: 'Shoulders', target_sets: 4, target_reps: 12, rest_seconds: 60 },
        ]
      },
      {
        name: 'Day 4: Legs',
        exercises: [
          { name: 'Barbell Squat', primary_muscle: 'Legs', target_sets: 4, target_reps: 8, rest_seconds: 120 },
          { name: 'Leg Press', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
          { name: 'Romanian Deadlift', primary_muscle: 'Legs', target_sets: 3, target_reps: 10, rest_seconds: 90 },
        ]
      },
      {
        name: 'Day 5: Arms',
        exercises: [
          { name: 'Bicep Curls', primary_muscle: 'Biceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
          { name: 'Tricep Pushdowns', primary_muscle: 'Triceps', target_sets: 3, target_reps: 12, rest_seconds: 60 },
        ]
      }
    ]
  }
]

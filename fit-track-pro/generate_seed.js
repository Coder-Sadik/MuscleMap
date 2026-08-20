const fs = require('fs');

const exercises = [
  // CHEST
  {
    name: "Barbell Bench Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on the bench with your eyes under the bar.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack the bar and lower it slowly to your mid-chest.",
      "Press the bar back up in a slight arc to the starting position."
    ],
    common_mistakes: ["Bouncing the bar off the chest", "Flaring elbows at 90 degrees", "Lifting glutes off the bench"],
    safety_cautions: ["Always use a spotter when lifting heavy weights.", "Keep your wrists straight to avoid injury."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Incline Dumbbell Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Set an adjustable bench to a 30-45 degree angle.",
      "Sit back with a dumbbell in each hand resting on your thighs.",
      "Kick the weights up to shoulder height and press them straight up.",
      "Lower the dumbbells slowly until you feel a stretch in your chest, then press back up."
    ],
    common_mistakes: ["Setting the incline too steep, targeting shoulders instead of chest", "Clinking dumbbells together at the top"],
    safety_cautions: ["Control the descent to avoid tearing a pectoral muscle."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Push-ups",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts", "Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in a high plank position with hands slightly wider than shoulder-width.",
      "Lower your body until your chest nearly touches the floor.",
      "Keep your core engaged and back straight.",
      "Push back up to the starting position."
    ],
    common_mistakes: ["Sagging the hips", "Looking straight down, dropping the neck", "Flaring elbows out too wide"],
    safety_cautions: ["Avoid overarching the lower back to prevent lumbar pain."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  
  // BACK
  {
    name: "Pull-ups",
    primary_muscle: "Back",
    secondary_muscles: ["Biceps", "Lats", "Rear Delts"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Grab the pull-up bar with an overhand grip slightly wider than shoulder-width.",
      "Hang freely with your arms fully extended.",
      "Pull yourself up by driving your elbows down until your chin clears the bar.",
      "Lower yourself back down with control."
    ],
    common_mistakes: ["Using momentum (kipping) instead of pure strength", "Not using a full range of motion"],
    safety_cautions: ["Warm up your shoulders properly before performing heavy pull-ups."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Barbell Row",
    primary_muscle: "Back",
    secondary_muscles: ["Biceps", "Lats", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, holding a barbell with an overhand grip.",
      "Hinge at the hips, keeping your back straight and nearly parallel to the floor.",
      "Pull the barbell towards your lower chest/upper abdomen.",
      "Lower the bar slowly back to the starting position."
    ],
    common_mistakes: ["Rounding the lower back", "Using momentum to jerk the weight up", "Standing too upright"],
    safety_cautions: ["If you have lower back issues, consider chest-supported rows instead."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Lat Pulldown",
    primary_muscle: "Back",
    secondary_muscles: ["Biceps", "Rear Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit at a lat pulldown machine and adjust the knee pad.",
      "Grab the wide bar with an overhand grip.",
      "Pull the bar down to your upper chest while squeezing your shoulder blades together.",
      "Slowly return the bar to the top."
    ],
    common_mistakes: ["Pulling the bar behind the neck", "Leaning too far back and using bodyweight to pull"],
    safety_cautions: ["Pulling behind the neck can cause rotator cuff injuries. Always pull to the front."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },

  // LEGS
  {
    name: "Barbell Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Glutes", "Hamstrings", "Core", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Position a barbell on your upper back and unrack it.",
      "Stand with feet slightly wider than shoulder-width apart, toes pointed slightly out.",
      "Brace your core and initiate the movement by pushing your hips back and bending your knees.",
      "Squat down until your thighs are at least parallel to the floor.",
      "Drive through your heels to stand back up."
    ],
    common_mistakes: ["Knees caving inward (valgus)", "Rounding the lower back (butt wink)", "Not squatting deep enough"],
    safety_cautions: ["Always use safety pins or a spotter when lifting heavy.", "Maintain a neutral spine at all times."],
    rest_recommendation: "120-180 seconds",
    video_url: null
  },
  {
    name: "Romanian Deadlift",
    primary_muscle: "Legs",
    secondary_muscles: ["Glutes", "Lower Back", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hold a barbell in front of you with an overhand grip.",
      "Keeping a slight bend in your knees, hinge forward at the hips.",
      "Lower the barbell down your legs until you feel a deep stretch in your hamstrings.",
      "Squeeze your glutes and push your hips forward to return to the starting position."
    ],
    common_mistakes: ["Bending the knees too much (turning it into a squat)", "Rounding the back", "Letting the bar drift away from the legs"],
    safety_cautions: ["Focus on the hip hinge. Do not force the range of motion if you lack flexibility."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Leg Press",
    primary_muscle: "Legs",
    secondary_muscles: ["Glutes", "Calves"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit on the leg press machine and place your feet on the sled shoulder-width apart.",
      "Unlatch the safety handles and lower the weight slowly until your knees are at 90 degrees.",
      "Press the sled back up without locking your knees out completely.",
      "Repeat for reps, then re-engage the safeties."
    ],
    common_mistakes: ["Locking out the knees completely at the top", "Lowering the weight too far so the lower back rounds off the pad"],
    safety_cautions: ["Never lock your knees backward under heavy load. It can cause severe injury."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },

  // SHOULDERS
  {
    name: "Overhead Press",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Triceps", "Upper Chest", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, holding a barbell at upper chest height.",
      "Brace your core and squeeze your glutes.",
      "Press the barbell straight up overhead until your arms are fully extended.",
      "Lower it back down to your upper chest under control."
    ],
    common_mistakes: ["Excessive arching of the lower back", "Pushing the bar out in front instead of straight up", "Using leg drive (which makes it a push press)"],
    safety_cautions: ["Be mindful of hitting your chin or nose on the way up. Move your head back slightly."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Lateral Raises",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Traps"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand holding a dumbbell in each hand by your sides.",
      "Keep a slight bend in your elbows and raise your arms out to the sides.",
      "Stop when your arms are parallel to the floor.",
      "Lower the weights slowly back down."
    ],
    common_mistakes: ["Swinging the torso to use momentum", "Raising the arms too high (above parallel)", "Leading with the wrists instead of the elbows"],
    safety_cautions: ["Do not use excessively heavy weights; focus on form and control to protect the shoulder joint."],
    rest_recommendation: "60 seconds",
    video_url: null
  },

  // ARMS
  {
    name: "Bicep Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Forearms"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand holding a dumbbell in each hand with a supinated (palms facing forward) grip.",
      "Keep your upper arms stationary and curl the weights towards your shoulders.",
      "Squeeze your biceps at the top.",
      "Lower the weights slowly back to the starting position."
    ],
    common_mistakes: ["Swinging the body", "Letting the elbows drift forward", "Not fully extending at the bottom"],
    safety_cautions: ["Use a controlled tempo to avoid elbow strain."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Tricep Pushdowns",
    primary_muscle: "Triceps",
    secondary_muscles: ["Forearms"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope or straight bar to a high cable pulley.",
      "Grab the attachment and stand with your elbows pinned to your sides.",
      "Push the weight down until your arms are fully extended, squeezing your triceps.",
      "Return slowly to the starting position."
    ],
    common_mistakes: ["Letting the elbows flare out", "Using bodyweight to push down", "Short range of motion"],
    safety_cautions: ["Keep your wrists neutral to prevent wrist pain."],
    rest_recommendation: "60 seconds",
    video_url: null
  }
];

// Generate SQL
let sql = `-- ==========================================
-- SEED EXERCISES DATA
-- ==========================================

`;

exercises.forEach(ex => {
  const name = ex.name.replace(/'/g, "''");
  const primaryMuscle = ex.primary_muscle.replace(/'/g, "''");
  const secondaryMuscles = `ARRAY[${ex.secondary_muscles.map(m => `'${m.replace(/'/g, "''")}'`).join(', ')}]`;
  const equipment = ex.equipment.replace(/'/g, "''");
  const difficulty = ex.difficulty.replace(/'/g, "''");
  const instructions = JSON.stringify(ex.instructions).replace(/'/g, "''");
  const mistakes = JSON.stringify(ex.common_mistakes).replace(/'/g, "''");
  const cautions = JSON.stringify(ex.safety_cautions).replace(/'/g, "''");
  const rest = ex.rest_recommendation.replace(/'/g, "''");

  sql += `INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
VALUES ('${name}', '${primaryMuscle}', ${secondaryMuscles}, '${equipment}', '${difficulty}', '${instructions}'::jsonb, '${mistakes}'::jsonb, '${cautions}'::jsonb, '${rest}', NULL);\n\n`;
});

fs.writeFileSync('seed.sql', sql);
console.log('Successfully generated seed.sql with ' + exercises.length + ' exercises.');

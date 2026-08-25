/* eslint-disable */
const fs = require('fs');

const exercises = [
  // ==========================================
  // CHEST (12 Exercises)
  // ==========================================
  {
    name: "Barbell Bench Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on the bench with your eyes directly under the racked bar.",
      "Grip the bar slightly wider than shoulder-width with wrists straight.",
      "Retract your shoulder blades and plant your feet firmly on the floor.",
      "Unrack the bar and lower it with control to your mid-chest.",
      "Press the bar back up in a slight arc toward eye level without bouncing."
    ],
    common_mistakes: ["Bouncing the bar off the ribcage", "Flaring elbows out at 90 degrees", "Lifting glutes off the bench"],
    safety_cautions: ["Always use a spotter or safety pins when lifting heavy.", "Keep your wrists neutral to prevent sprains."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Incline Dumbbell Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Upper Chest", "Front Delts", "Triceps"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Set an adjustable bench to a 30 to 45-degree incline.",
      "Sit back with dumbbells resting vertically on your thighs.",
      "Kick the weights up smoothly to shoulder level one by one.",
      "Press the dumbbells upward until arms are extended above your upper chest.",
      "Lower under control until you feel a deep stretch across the pectorals."
    ],
    common_mistakes: ["Setting the incline too high (turns into shoulder press)", "Banging dumbbells together at the top", "Dropping elbows too low"],
    safety_cautions: ["Maintain a controlled tempo on the descent to protect the pec tendon."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Incline Barbell Bench Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Upper Chest", "Front Delts", "Triceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie on an incline bench angled between 30 and 45 degrees.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack and lower the bar slowly to your clavicle / upper chest area.",
      "Drive through your palms to press the bar back up to starting position."
    ],
    common_mistakes: ["Lowering the bar too low onto the stomach", "Arching lower back excessively off the incline pad"],
    safety_cautions: ["Ensure secure grip with thumb wrapped around the bar."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Decline Barbell Bench Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Lower Chest", "Triceps", "Front Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Secure your legs in the decline bench pads and lie back.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack and lower the barbell slowly to the lower chest line.",
      "Press the barbell straight up until arms are fully extended."
    ],
    common_mistakes: ["Letting the bar drift over the face or neck", "Losing leg anchor stability"],
    safety_cautions: ["Always ensure legs are locked firmly in position before unracking."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Flat Dumbbell Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Sit on a flat bench with dumbbells resting on your knees.",
      "Lie back and kick the dumbbells up into pressing position over your chest.",
      "Lower the dumbbells outward until elbows are slightly below bench level.",
      "Press the dumbbells back up together, focusing on chest contraction."
    ],
    common_mistakes: ["Flaring elbows excessively", "Arching spine off the bench"],
    safety_cautions: ["Drop dumbbells outward safely to the floor only if using bumper mats."],
    rest_recommendation: "60-90 seconds",
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
      "Keep your body in a straight line from head to heels with core braced.",
      "Lower your chest until it hovers an inch above the floor.",
      "Push forcefully through your hands to return to the top position."
    ],
    common_mistakes: ["Sagging the hips", "Craning the neck downward", "Flaring elbows out to 90 degrees"],
    safety_cautions: ["Keep core tight to avoid lumbar hyperextension."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Chest Dips",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts", "Lower Chest"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Mount parallel bars and support your bodyweight with straight arms.",
      "Lean your torso forward at roughly a 30-degree angle.",
      "Bend your elbows and lower your body until elbows reach 90 degrees.",
      "Press through your palms to push yourself back up to the top."
    ],
    common_mistakes: ["Staying completely upright (shifts tension to triceps)", "Dipping too deep into shoulder strain", "Swinging legs"],
    safety_cautions: ["Avoid this exercise if you have pre-existing shoulder impingement."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Cable Chest Flyes",
    primary_muscle: "Chest",
    secondary_muscles: ["Front Delts"],
    equipment: "Cable",
    difficulty: "Intermediate",
    instructions: [
      "Set cable pulleys at chest height with single handles attached.",
      "Step forward into a staggered stance with a slight forward torso lean.",
      "With elbows slightly bent, bring handles together in an arc in front of your chest.",
      "Squeeze your chest hard at peak contraction, then open arms slowly under tension."
    ],
    common_mistakes: ["Bending and extending elbows (turning it into a press)", "Letting the cables pull shoulders back too fast"],
    safety_cautions: ["Keep a constant slight bend in the elbows to protect the biceps tendon."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Incline Cable Flyes",
    primary_muscle: "Chest",
    secondary_muscles: ["Upper Chest", "Front Delts"],
    equipment: "Cable",
    difficulty: "Intermediate",
    instructions: [
      "Set cable pulleys to the lowest position with single handles.",
      "Stand staggered, take a step forward, and keep arms wide with slight elbow bend.",
      "Sweep hands upward and inward in an arc toward eye level.",
      "Squeeze upper chest at top, then lower with control."
    ],
    common_mistakes: ["Using excessive momentum", "Shrugging shoulders into the neck"],
    safety_cautions: ["Select moderate weight to maintain shoulder control."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Pec Deck Machine Flyes",
    primary_muscle: "Chest",
    secondary_muscles: ["Front Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust the seat so handles or pads sit level with your mid-chest.",
      "Rest forearms or hands against the pads and keep chest up.",
      "Contract pectorals to bring the pads together in front of you.",
      "Hold the squeeze for 1 second, then return smoothly."
    ],
    common_mistakes: ["Letting the weight stack slam at the back", "Rounding shoulders forward at full contraction"],
    safety_cautions: ["Do not allow the machine to hyper-extend your shoulders backward."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Machine Chest Press",
    primary_muscle: "Chest",
    secondary_muscles: ["Triceps", "Front Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust the seat height so the handles align with your mid-chest.",
      "Sit back firmly, plant feet, and grip the handles.",
      "Press forward until arms are almost fully extended without locking elbows.",
      "Lower under control until handles return to chest depth."
    ],
    common_mistakes: ["Slouching in the seat", "Locking elbows harshly at the end of the press"],
    safety_cautions: ["Keep head and back pressed against the pad throughout the set."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Dumbbell Pullover",
    primary_muscle: "Chest",
    secondary_muscles: ["Lats", "Serratus Anterior", "Triceps"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie perpendicular across a flat bench with your upper back supported.",
      "Hold a single dumbbell overhead with both hands in a diamond cup grip.",
      "Slowly lower the dumbbell back over your head in an arc while keeping arms slightly bent.",
      "Pull the dumbbell back up over your chest by contracting your chest and lats."
    ],
    common_mistakes: ["Bending elbows too much (making it a tricep extension)", "Dropping hips excessively"],
    safety_cautions: ["Use a secure grip; never let the weight slip above your face."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },

  // ==========================================
  // BACK (13 Exercises)
  // ==========================================
  {
    name: "Deadlift (Conventional)",
    primary_muscle: "Back",
    secondary_muscles: ["Glutes", "Hamstrings", "Lower Back", "Traps", "Forearms"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Stand with mid-foot directly under the barbell, feet hip-width apart.",
      "Hinge at the hips, bend knees, and grip bar just outside your shins.",
      "Pull chest up, flatten your back, and engage your lats.",
      "Drive the floor away through your heels, extending hips and knees simultaneously.",
      "Stand tall at the top without hyperextending your lumbar spine."
    ],
    common_mistakes: ["Rounding the lower back", "Jerking the bar off the floor without taking the slack out", "Bar drifting away from the shins"],
    safety_cautions: ["Never lift with a rounded spine. Keep the barbell against your legs throughout the lift."],
    rest_recommendation: "120-180 seconds",
    video_url: null
  },
  {
    name: "Pull-ups",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Biceps", "Rear Delts", "Upper Back"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Grip the pull-up bar with an overhand grip slightly wider than shoulder-width.",
      "Start from a full dead hang with arms extended and shoulders engaged.",
      "Pull yourself up by driving your elbows down towards your ribs.",
      "Continue until your chin clears the top of the bar.",
      "Lower yourself back down with complete control."
    ],
    common_mistakes: ["Kipping or swinging legs for momentum", "Not completing the full range of motion at bottom"],
    safety_cautions: ["Warm up shoulders and rotators before heavy sets."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Chin-ups",
    primary_muscle: "Back",
    secondary_muscles: ["Biceps", "Lats", "Core"],
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    instructions: [
      "Grip the bar with an underhand (supinated) grip at shoulder-width.",
      "Hang with arms fully extended.",
      "Pull your body upward by engaging your back and biceps until chin is above the bar.",
      "Lower under control back to full extension."
    ],
    common_mistakes: ["Dropping down rapidly without eccentric control", "Short-changing the top squeeze"],
    safety_cautions: ["Control the descent to avoid strain on the bicep tendon."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Barbell Row",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Rhomboids", "Biceps", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand feet hip-width apart holding a barbell with an overhand grip.",
      "Hinge at your hips until your torso is approximately 45 degrees to the floor.",
      "Keep spine neutral and pull the barbell to your lower ribcage / navel.",
      "Squeeze your shoulder blades together at the top, then lower the bar with control."
    ],
    common_mistakes: ["Rounding the lower back", "Using torso jerking momentum", "Standing too upright"],
    safety_cautions: ["Brace your core tight to support the lower back during the hinge."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Lat Pulldown",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Biceps", "Rear Delts"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit at the pulldown station and secure the thigh pads firmly.",
      "Grip the wide bar with an overhand grip wider than shoulder-width.",
      "Lean back slightly (10-15 degrees) and pull the bar down toward your upper chest.",
      "Squeeze lats at the bottom, then let the bar rise back up under control."
    ],
    common_mistakes: ["Pulling the bar behind the neck", "Leaning back excessively to turn it into a row", "Letting the stack crash"],
    safety_cautions: ["Never pull behind the neck to protect the cervical spine and rotator cuff."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Seated Cable Row",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Rhomboids", "Biceps", "Traps"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Sit on the bench with feet on the footplates and knees slightly bent.",
      "Grasp the V-bar handle and sit upright with a neutral spine.",
      "Pull the handle toward your abdomen while keeping your elbows close to your sides.",
      "Squeeze your shoulder blades together, then return slowly to the starting position."
    ],
    common_mistakes: ["Excessive rocking forward and back", "Rounding the lower back at the reach", "Shrugging the shoulders upward"],
    safety_cautions: ["Keep the core engaged to prevent lumbar rounding during the stretch."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Single-Arm Dumbbell Row",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Rhomboids", "Biceps", "Rear Delts"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Place your left knee and left hand firmly on a flat bench.",
      "Hold a dumbbell in your right hand with your right foot on the ground.",
      "Keep your back flat and pull the dumbbell toward your right hip.",
      "Pause and squeeze your lat at the top, then lower the dumbbell fully."
    ],
    common_mistakes: ["Twisting the torso excessively at the top", "Pulling straight up into the chest instead of towards the hip"],
    safety_cautions: ["Maintain a flat back throughout to protect the spine."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "T-Bar Row",
    primary_muscle: "Back",
    secondary_muscles: ["Middle Back", "Lats", "Traps", "Biceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Straddle the T-bar apparatus or landmine barbell with feet shoulder-width apart.",
      "Hinge at the hips with a flat back and grip the handles.",
      "Pull the weight upward toward your upper abdomen / chest.",
      "Squeeze back muscles at top, then lower smoothly."
    ],
    common_mistakes: ["Standing up too high during the pull", "Rounding the spine under heavy load"],
    safety_cautions: ["Use 25lb / smaller plates if 45lb plates limit your range of motion."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Straight-Arm Cable Pulldown",
    primary_muscle: "Back",
    secondary_muscles: ["Lats", "Teres Major", "Triceps Long Head"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a straight or curved bar to a high cable pulley.",
      "Step back slightly, hinge forward at hips with arms almost straight.",
      "Pull the bar in a downward arc toward your thighs using only your lats.",
      "Squeeze lats hard at bottom, then slowly let the bar return to eye level."
    ],
    common_mistakes: ["Bending elbows and turning the exercise into a tricep pushdown", "Using momentum by bobbing the torso"],
    safety_cautions: ["Keep a slight bend in elbows to protect joints."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Chest-Supported Machine Row",
    primary_muscle: "Back",
    secondary_muscles: ["Rhomboids", "Middle Back", "Biceps"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust the seat so your chest rests firmly on the chest pad.",
      "Reach forward, grip the handles, and keep feet planted.",
      "Pull handles toward your ribs, driving elbows back.",
      "Hold the contraction for a beat, then return under control."
    ],
    common_mistakes: ["Letting chest lift off the support pad to cheat the weight", "Rushing through the eccentric phase"],
    safety_cautions: ["Keep chest against the pad for full spinal protection."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Face Pulls",
    primary_muscle: "Back",
    secondary_muscles: ["Rear Delts", "Rotator Cuff", "Upper Traps"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope to a cable station at upper chest / face height.",
      "Grip the rope ends with thumbs pointing backward.",
      "Step back and pull the rope directly towards your face, separating the ends.",
      "Rotate hands backward at the end of the pull, squeezing the rear shoulders."
    ],
    common_mistakes: ["Using too much weight and pulling down to the chest", "Leaning back excessively"],
    safety_cautions: ["Focus on external rotation and light weight for shoulder health."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Barbell Shrugs",
    primary_muscle: "Back",
    secondary_muscles: ["Traps", "Forearms"],
    equipment: "Barbell",
    difficulty: "Beginner",
    instructions: [
      "Stand tall holding a barbell in front of your thighs with an overhand grip.",
      "Elevate your shoulders directly up toward your ears in a shrugging motion.",
      "Hold the peak contraction at the top for 1 to 2 seconds.",
      "Lower shoulders back down under full control."
    ],
    common_mistakes: ["Rolling shoulders in circles (can strain rotator cuff)", "Bending elbows to assist lift"],
    safety_cautions: ["Only shrug vertically up and down; never roll shoulders."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Hyperextensions (Back Extensions)",
    primary_muscle: "Back",
    secondary_muscles: ["Lower Back", "Glutes", "Hamstrings"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Position yourself on the back extension bench with hips resting on the pad.",
      "Cross your arms over your chest or hold a weight plate.",
      "Hinge forward at the hips, lowering your torso toward the floor.",
      "Raise your torso back up until your body forms a straight line."
    ],
    common_mistakes: ["Hyperextending the spine past neutral at the top", "Jerking upward quickly"],
    safety_cautions: ["Stop once body is in line; avoid curving backward."],
    rest_recommendation: "60 seconds",
    video_url: null
  },

  // ==========================================
  // SHOULDERS (10 Exercises)
  // ==========================================
  {
    name: "Overhead Press",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Front Delts", "Triceps", "Upper Chest", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, holding a barbell across your collarbone.",
      "Brace your core, squeeze your glutes, and tilt your head back slightly.",
      "Press the bar vertically overhead until arms are locked out.",
      "Push your head forward slightly as the bar passes your forehead.",
      "Lower the bar under control back to your upper chest."
    ],
    common_mistakes: ["Excessively arching the lower back", "Pushing the bar out in front rather than straight up", "Using leg drive on strict press"],
    safety_cautions: ["Keep your core braced tight to protect the lumbar spine."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Seated Dumbbell Shoulder Press",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Front Delts", "Triceps", "Traps"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Sit on an upright bench with dumbbells resting on your knees.",
      "Kick dumbbells up to ear height with palms facing forward.",
      "Press the weights overhead in a smooth arc until arms are extended.",
      "Lower slowly until dumbbells return to ear / chin height."
    ],
    common_mistakes: ["Arching the lower back away from the back pad", "Banging dumbbells at the top"],
    safety_cautions: ["Keep back flat against the backrest."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Arnold Press",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Front Delts", "Side Delts", "Triceps"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Sit on an upright bench holding dumbbells at chin height with palms facing you.",
      "As you press the weights up, rotate your wrists outward.",
      "Finish the press with palms facing forward at full overhead lockout.",
      "Reverse the rotation smoothly as you lower the weights back to the start."
    ],
    common_mistakes: ["Jerking during the rotation", "Using excessive weight that compromises rotator cuff control"],
    safety_cautions: ["Start light to master the rotational movement pattern."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Lateral Raises",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Side Delts", "Traps"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand tall holding dumbbells at your sides with a slight forward torso tilt.",
      "With a slight bend in your elbows, raise the weights out to your sides.",
      "Lift until your arms are parallel to the floor, leading with your elbows.",
      "Lower the dumbbells back down slowly under full control."
    ],
    common_mistakes: ["Swinging the body to create momentum", "Raising weights higher than shoulder level", "Shrugging traps upward"],
    safety_cautions: ["Avoid heavy weights that force jerking or shoulder impingement."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Cable Lateral Raises",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Side Delts"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Set a low pulley and stand with the cable running behind or in front of your legs.",
      "Grip the single handle with the opposite hand.",
      "Raise the handle out to your side until arm is parallel to the ground.",
      "Slowly resist the cable tension on the way down."
    ],
    common_mistakes: ["Using body swing to start the lift", "Dropping the weight abruptly"],
    safety_cautions: ["Maintain a constant slight elbow bend."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Bent-Over Dumbbell Rear Delt Flyes",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Rear Delts", "Rhomboids", "Traps"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Hinge at the hips until your torso is nearly parallel to the floor.",
      "Let dumbbells hang straight down with palms facing each other.",
      "With elbows slightly bent, raise the weights out to your sides.",
      "Squeeze your rear deltoids at the top, then lower with control."
    ],
    common_mistakes: ["Standing up too straight", "Using momentum from the back and legs"],
    safety_cautions: ["Keep neck neutral and avoid looking up excessively."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Reverse Pec Deck Flyes",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Rear Delts", "Rhomboids", "Upper Back"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit facing the pec deck machine with your chest against the pad.",
      "Grip the horizontal handles with palms facing down or neutral.",
      "Pull the handles out and back in a wide arc using your rear delts.",
      "Pause briefly at peak contraction, then return slowly."
    ],
    common_mistakes: ["Using momentum to slam handles back", "Bending elbows excessively during the fly"],
    safety_cautions: ["Adjust seat height so handles sit level with your shoulders."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Dumbbell Front Raises",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Front Delts", "Upper Chest"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand tall holding dumbbells across the front of your thighs.",
      "Raise one or both dumbbells straight in front of you up to shoulder height.",
      "Hold for a split second, then lower slowly back to your thighs."
    ],
    common_mistakes: ["Leaning backward to swing weights up", "Raising arms higher than eye level"],
    safety_cautions: ["Control the descent to protect the anterior capsule."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Upright Rows",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Side Delts", "Traps", "Biceps"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hold an EZ bar or barbell in front of your thighs with a shoulder-width grip.",
      "Pull the bar vertically along your body until elbows reach shoulder height.",
      "Keep elbows higher than your wrists throughout the movement.",
      "Lower the bar back down with control."
    ],
    common_mistakes: ["Using an excessively narrow grip (causes wrist/shoulder pinch)", "Pulling the bar too high up to the chin"],
    safety_cautions: ["Use a wider grip to reduce internal shoulder rotation and impingement risk."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Machine Shoulder Press",
    primary_muscle: "Shoulders",
    secondary_muscles: ["Front Delts", "Triceps", "Upper Chest"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust the seat so handles start at shoulder height.",
      "Sit back firmly, grip handles, and press upward smoothly.",
      "Extend arms without locking elbows harshly.",
      "Lower the weight back to the start under control."
    ],
    common_mistakes: ["Allowing elbows to drop too far behind the torso", "Arching lower back off the pad"],
    safety_cautions: ["Ensure seat height prevents excessive shoulder extension at bottom."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },

  // ==========================================
  // LEGS (15 Exercises)
  // ==========================================
  {
    name: "Barbell Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Hamstrings", "Core", "Lower Back"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Position the barbell across your upper traps and unrack it.",
      "Stand with feet slightly wider than shoulder-width, toes angled slightly out.",
      "Brace your core, push hips back, and bend knees to squat down.",
      "Descend until your hip crease is at or below the top of your knees.",
      "Drive through your mid-foot and heels to return to standing."
    ],
    common_mistakes: ["Knees collapsing inward (valgus)", "Rounding the lower back (butt wink)", "Rising onto toes"],
    safety_cautions: ["Always use safety catch bars inside a power rack when squatting."],
    rest_recommendation: "120-180 seconds",
    video_url: null
  },
  {
    name: "Barbell Front Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Upper Back", "Core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Rack the barbell across your front deltoids with fingertips under the bar and elbows high.",
      "Stand tall, brace core, and initiate squat by sitting down between your knees.",
      "Maintain a vertical torso and keep elbows pointing forward throughout.",
      "Squat to parallel or deeper, then drive straight back up."
    ],
    common_mistakes: ["Dropping elbows (causes the bar to roll off)", "Rounding the thoracic spine forward"],
    safety_cautions: ["Dump the bar forward safely onto safety pins if balance is lost."],
    rest_recommendation: "120-180 seconds",
    video_url: null
  },
  {
    name: "Romanian Deadlift",
    primary_muscle: "Legs",
    secondary_muscles: ["Hamstrings", "Glutes", "Lower Back", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Hold a barbell at hip height with an overhand grip and knees slightly unlocked.",
      "Hinge at the hips and push your butt backward toward the wall.",
      "Slide the barbell down close to your shins until feeling a deep hamstring stretch.",
      "Drive your hips forward and squeeze your glutes to return to standing."
    ],
    common_mistakes: ["Bending knees into a squat", "Rounding the spine", "Allowing the barbell to drift away from the legs"],
    safety_cautions: ["Keep the bar in contact with your legs to minimize lumbar shearing."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Dumbbell Romanian Deadlift",
    primary_muscle: "Legs",
    secondary_muscles: ["Hamstrings", "Glutes", "Lower Back"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Hold a pair of dumbbells in front of your thighs with a neutral spine.",
      "With a soft bend in your knees, push your hips backward to lower the dumbbells.",
      "Lower until the weights reach mid-shin level with back flat.",
      "Squeeze glutes and extend hips to stand upright."
    ],
    common_mistakes: ["Rounding the back to reach lower than mobility allows", "Squatting instead of hinging"],
    safety_cautions: ["Maintain neutral neck alignment by looking a few feet ahead on the floor."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Leg Press",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Hamstrings"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit on the leg press machine and place feet hip-width apart on the sled.",
      "Release the safety levers and lower the sled slowly until knees bend to 90 degrees.",
      "Press through your whole foot to push the platform back up.",
      "Do not lock your knees out completely at the top of the rep."
    ],
    common_mistakes: ["Locking knees backward at the top", "Lowering sled too far so lower back lifts off seat pad"],
    safety_cautions: ["Never lock your knees into hyperextension under heavy load."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Hack Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes"],
    equipment: "Machine",
    difficulty: "Intermediate",
    instructions: [
      "Position your back and shoulders against the hack squat pads.",
      "Place feet shoulder-width apart in the middle of the platform.",
      "Disengage safety levers and lower down smoothly into a deep squat.",
      "Drive through your heels to return to the starting position."
    ],
    common_mistakes: ["Lifting heels off the platform", "Stopping way short of parallel depth"],
    safety_cautions: ["Re-engage safety handles securely before stepping off."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Bulgarian Split Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Hamstrings", "Calves"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand 2-3 feet in front of a flat bench and place the top of one foot on the bench behind you.",
      "Hold dumbbells at your sides and brace your core.",
      "Lower your back knee towards the floor until your front thigh is parallel to the ground.",
      "Drive through the front heel to return to the top position."
    ],
    common_mistakes: ["Front foot positioned too close to the bench", "Knee caving inward on descent", "Leaning too far forward"],
    safety_cautions: ["Master the movement with bodyweight before adding heavy dumbbells."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Walking Lunges",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Hamstrings", "Calves"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Hold dumbbells at your sides and take a long step forward.",
      "Lower your back knee until it gently touches or hovers an inch above the floor.",
      "Drive through the front heel and step straight into the next lunge with the opposite leg.",
      "Keep torso upright and core engaged throughout."
    ],
    common_mistakes: ["Short steps that stress the front knee", "Letting the front knee collapse inward"],
    safety_cautions: ["Avoid slamming the back knee onto hard flooring."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Goblet Squat",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads", "Glutes", "Core"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Hold a single dumbbell or kettlebell vertically against your chest with both hands.",
      "Stand with feet shoulder-width apart, toes slightly turned out.",
      "Squat down by pushing hips back and knees out, keeping elbows inside knees.",
      "Descend to parallel or below, then press through the floor to stand."
    ],
    common_mistakes: ["Letting the weight pull your upper body forward", "Knees caving inward"],
    safety_cautions: ["Keep the weight close to the sternum to minimize back strain."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Leg Extensions",
    primary_muscle: "Legs",
    secondary_muscles: ["Quads"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Adjust the machine so the pad sits on top of your lower shins and your knees align with the pivot.",
      "Sit back firmly against the back pad and grip the side handles.",
      "Extend your legs to lift the weight until knees are straight.",
      "Squeeze your quadriceps at the top for 1 second, then lower with control."
    ],
    common_mistakes: ["Kicking the weight up quickly with momentum", "Allowing the weight stack to slam at bottom"],
    safety_cautions: ["Avoid this exercise or use light weight if you have acute patellar tendinitis."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Lying Leg Curls",
    primary_muscle: "Legs",
    secondary_muscles: ["Hamstrings", "Calves"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Lie face down on the leg curl machine with the roller pad resting on your lower calves.",
      "Grip the handles under the bench to keep your hips glued to the pad.",
      "Curl your heels toward your glutes as far as comfortably possible.",
      "Lower the weight back down slowly under tension."
    ],
    common_mistakes: ["Lifting hips off the bench to assist the curl", "Dropping the weight without eccentric control"],
    safety_cautions: ["Keep hips pressed down to isolate the hamstrings and protect the lower back."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Seated Leg Curls",
    primary_muscle: "Legs",
    secondary_muscles: ["Hamstrings"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit on the machine with the thigh pad secured firmly against your legs.",
      "Position the ankle pad behind your lower calves.",
      "Flex your knees to pull your heels downward and under the seat.",
      "Hold the squeeze at full contraction, then slowly extend legs back."
    ],
    common_mistakes: ["Letting the thigh pad stay loose", "Slouching forward during the curl"],
    safety_cautions: ["Fasten the lap pad snugly to prevent thigh lift."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Barbell Hip Thrusts",
    primary_muscle: "Legs",
    secondary_muscles: ["Glutes", "Hamstrings", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Sit on the floor with your upper back resting against a sturdy flat bench.",
      "Roll a padded barbell over your hips and plant your feet flat on the floor, shoulder-width apart.",
      "Drive through your heels to lift your hips until your thighs and torso form a straight line.",
      "Squeeze your glutes hard at the top with chin tucked, then lower under control."
    ],
    common_mistakes: ["Hyperextending the lower back at the top", "Pushing through toes instead of heels", "Looking at the ceiling instead of forward"],
    safety_cautions: ["Always use a thick barbell pad to protect the pelvic bones."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Standing Calf Raises",
    primary_muscle: "Legs",
    secondary_muscles: ["Calves"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Place your shoulders under the pads and the balls of your feet on the step edge.",
      "Lower your heels as far as possible for a full calf stretch.",
      "Drive through the balls of your feet to raise yourself as high as possible.",
      "Hold peak contraction for 1 second before lowering slowly."
    ],
    common_mistakes: ["Bouncing at the bottom using Achilles tendon elasticity", "Bending knees to assist lift"],
    safety_cautions: ["Perform with a 2-second pause at the bottom stretch to prevent strain."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Seated Calf Raises",
    primary_muscle: "Legs",
    secondary_muscles: ["Calves", "Soleus"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Sit on the machine with thigh pad secured on top of your lower thighs.",
      "Place balls of feet on the platform edge and release the safety pin.",
      "Lower heels deeply to feel a stretch in the soleus.",
      "Push up through the balls of your feet to full plantarflexion, hold, then lower."
    ],
    common_mistakes: ["Fast bouncing without full stretch", "Incomplete range of motion at the top"],
    safety_cautions: ["Lock the safety pin securely when finished."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },

  // ==========================================
  // ARMS - BICEPS (8 Exercises)
  // ==========================================
  {
    name: "Bicep Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Forearms", "Brachialis"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand holding a dumbbell in each hand with palms facing forward.",
      "Keep upper arms pinned to your sides and curl the dumbbells toward your shoulders.",
      "Squeeze your biceps tightly at the top of the curl.",
      "Lower the weights slowly back down to full arm extension."
    ],
    common_mistakes: ["Swinging the body for momentum", "Letting elbows drift forward excessively", "Not fully extending at the bottom"],
    safety_cautions: ["Use controlled cadence to protect the distal bicep tendon."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Barbell Bicep Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Forearms", "Brachialis"],
    equipment: "Barbell",
    difficulty: "Beginner",
    instructions: [
      "Stand tall holding a barbell with an underhand grip shoulder-width apart.",
      "Keep your core braced and elbows tucked against your ribcage.",
      "Curl the barbell upward in a smooth arc toward your upper chest.",
      "Squeeze your biceps at the top, then lower the bar with control."
    ],
    common_mistakes: ["Leaning backward to cheat the weight up", "Short-changing the bottom stretch"],
    safety_cautions: ["Use an EZ bar if straight barbell causes wrist or elbow strain."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Incline Dumbbell Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Biceps Long Head", "Forearms"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Sit back on an incline bench set to roughly 45 to 60 degrees.",
      "Let your arms hang straight down toward the floor with dumbbells.",
      "Curl the weights upward while keeping your upper arms stationary.",
      "Squeeze biceps at the top, then lower with control into a full long-head stretch."
    ],
    common_mistakes: ["Swinging the arms forward", "Lifting shoulders off the bench pad"],
    safety_cautions: ["Do not use excessive weight; the stretched position requires strict control."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Hammer Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Brachialis", "Brachioradialis", "Forearms"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand holding dumbbells at your sides with palms facing each other (neutral grip).",
      "Keep upper arms still and curl the dumbbells toward your shoulders.",
      "Squeeze the brachialis and forearm at the top of the curl.",
      "Lower the dumbbells slowly back down to starting position."
    ],
    common_mistakes: ["Using torso momentum", "Rotating the wrists (keep neutral throughout)"],
    safety_cautions: ["Maintain a firm grip to prevent wrist deflection."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Preacher Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Biceps Short Head", "Forearms"],
    equipment: "EZ Bar",
    difficulty: "Intermediate",
    instructions: [
      "Sit at a preacher bench and rest the back of your upper arms flat against the pad.",
      "Grip the inner curves of an EZ curl bar with an underhand grip.",
      "Curl the bar upward toward your chin until biceps are fully contracted.",
      "Lower the bar slowly until arms are extended (stop just short of hyperextending)."
    ],
    common_mistakes: ["Lifting elbows off the pad", "Hyperextending elbows abruptly at the bottom"],
    safety_cautions: ["Never bounce the bar at full extension; maintain bicep tension to protect tendons."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Concentration Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Forearms"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Sit on the edge of a bench with legs open and hold a dumbbell in one hand.",
      "Press the back of your upper arm against the inside of your same-side thigh.",
      "Curl the dumbbell upward toward your face while keeping the arm locked in place.",
      "Squeeze at the top, then slowly lower to the start position."
    ],
    common_mistakes: ["Using leg movement to bounce the weight", "Curling with a loose wrist"],
    safety_cautions: ["Focus on mind-muscle connection and light-to-moderate load."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Cable Bicep Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Forearms"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a straight or EZ bar to the bottom pulley of a cable machine.",
      "Stand a step back and grip the bar with an underhand grip.",
      "Curl the bar upward while maintaining continuous cable tension.",
      "Squeeze at the peak, then lower the bar with control."
    ],
    common_mistakes: ["Stepping too close or too far from the pulley", "Allowing elbows to flare outward"],
    safety_cautions: ["Keep spine neutral and core braced throughout."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Spider Curls",
    primary_muscle: "Biceps",
    secondary_muscles: ["Biceps Short Head", "Brachialis"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie face down on a 45-degree incline bench with your chest supported.",
      "Let your arms hang straight down perpendicular to the floor holding dumbbells.",
      "Curl the dumbbells upward without allowing upper arms to swing back.",
      "Squeeze peak contraction at the top, then lower with control."
    ],
    common_mistakes: ["Swinging elbows backward toward hips", "Rushing through the bottom stretch"],
    safety_cautions: ["Keep chest firmly against pad to eliminate momentum."],
    rest_recommendation: "60 seconds",
    video_url: null
  },

  // ==========================================
  // ARMS - TRICEPS (8 Exercises)
  // ==========================================
  {
    name: "Tricep Pushdowns",
    primary_muscle: "Triceps",
    secondary_muscles: ["Forearms"],
    equipment: "Machine",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope or straight bar to a high cable pulley.",
      "Stand with feet shoulder-width apart, elbows pinned to your sides.",
      "Push the attachment down until arms are fully locked out at bottom.",
      "Squeeze triceps hard, then return slowly to 90-degree elbow bend."
    ],
    common_mistakes: ["Letting elbows flare out or drift forward and backward", "Using bodyweight to press down"],
    safety_cautions: ["Keep wrists straight and avoid hyperextending shoulders."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Skull Crushers (Lying Tricep Extensions)",
    primary_muscle: "Triceps",
    secondary_muscles: ["Forearms", "Chest"],
    equipment: "EZ Bar",
    difficulty: "Intermediate",
    instructions: [
      "Lie on a flat bench holding an EZ bar with an overhand grip above your chest.",
      "Keep upper arms angled slightly back toward your head (around 75 degrees).",
      "Bend elbows to lower the bar toward your forehead / top of head.",
      "Extend your elbows smoothly to press the bar back up to the start."
    ],
    common_mistakes: ["Flaring elbows out to the sides", "Allowing upper arms to move forward and back"],
    safety_cautions: ["Control the descent carefully so the bar does not hit your face or forehead."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Overhead Dumbbell Tricep Extension",
    primary_muscle: "Triceps",
    secondary_muscles: ["Triceps Long Head", "Core"],
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Sit or stand tall holding a single dumbbell with both hands overhead in a diamond cup grip.",
      "Keep elbows pointing forward and upper arms close to your ears.",
      "Lower the dumbbell behind your head by bending your elbows.",
      "Press the dumbbell back overhead until arms are extended."
    ],
    common_mistakes: ["Flaring elbows wide to the sides", "Arching lower back excessively"],
    safety_cautions: ["Secure the dumbbell firmly between palms to prevent slipping."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Overhead Cable Tricep Extension",
    primary_muscle: "Triceps",
    secondary_muscles: ["Triceps Long Head"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope to a cable pulley at waist or head height and turn away in a staggered stance.",
      "Hold the rope behind your head with elbows bent.",
      "Extend your arms forward and overhead, pulling the rope ends apart at lockout.",
      "Slowly allow hands to return behind your head for a deep tricep stretch."
    ],
    common_mistakes: ["Letting the cable pull your torso backward", "Dropping elbows during the extension"],
    safety_cautions: ["Keep a firm staggered base to maintain balance."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Close-Grip Barbell Bench Press",
    primary_muscle: "Triceps",
    secondary_muscles: ["Chest", "Front Delts"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie on a flat bench and grip the barbell with hands shoulder-width apart (not too narrow).",
      "Unrack the bar and lower it under control to your lower chest/sternum.",
      "Keep elbows tucked close to your ribs on the descent.",
      "Press the barbell back up by engaging your triceps."
    ],
    common_mistakes: ["Gripping the bar with hands touching (wrecks wrists and elbows)", "Flaring elbows out"],
    safety_cautions: ["A shoulder-width grip is optimal to protect wrists and isolate triceps."],
    rest_recommendation: "90-120 seconds",
    video_url: null
  },
  {
    name: "Tricep Dips (Bench Dips)",
    primary_muscle: "Triceps",
    secondary_muscles: ["Front Delts", "Chest"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Sit on the edge of a bench and place hands next to your hips with fingers forward.",
      "Walk feet out and slide your glutes off the bench edge.",
      "Bend elbows to lower hips toward the floor until elbows reach 90 degrees.",
      "Press through your palms to return to full arm extension."
    ],
    common_mistakes: ["Dipping too low into internal shoulder rotation", "Allowing hips to drift far from the bench"],
    safety_cautions: ["Keep your back close to the bench to minimize shoulder strain."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Single-Arm Cable Kickbacks",
    primary_muscle: "Triceps",
    secondary_muscles: ["Rear Delts"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Set cable to chest height without attachment (grip rubber ball or handle).",
      "Hinge forward at hips and pin your upper arm parallel to your torso.",
      "Extend your arm straight back until tricep is fully contracted.",
      "Pause for a peak squeeze, then return smoothly."
    ],
    common_mistakes: ["Dropping the elbow during the kickback", "Using swing momentum"],
    safety_cautions: ["Keep the upper arm stationary throughout the set."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },

  // ==========================================
  // ARMS - FOREARMS (3 Exercises)
  // ==========================================
  {
    name: "Barbell Wrist Curls",
    primary_muscle: "Forearms",
    secondary_muscles: ["Grip"],
    equipment: "Barbell",
    difficulty: "Beginner",
    instructions: [
      "Sit on a bench resting your forearms on your thighs with wrists hanging over knees, palms facing up.",
      "Hold a light barbell with fingertips and curl your wrists upward.",
      "Squeeze forearms at the top, then lower the bar down slowly, opening fingers slightly.",
      "Curl fingers and wrists back up."
    ],
    common_mistakes: ["Using too much weight causing wrist pain", "Lifting forearms off the thighs"],
    safety_cautions: ["Use light weight and controlled tempo to protect wrist joints."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Reverse Wrist Curls",
    primary_muscle: "Forearms",
    secondary_muscles: ["Wrist Extensors"],
    equipment: "Barbell",
    difficulty: "Beginner",
    instructions: [
      "Rest forearms on your thighs or a flat bench with wrists over the edge, palms facing down.",
      "Hold a light barbell and curl your wrists upward as high as possible.",
      "Hold the contraction for 1 second, then lower with control."
    ],
    common_mistakes: ["Jerking the weight", "Lifting the forearms off support"],
    safety_cautions: ["Wrist extensors are small muscles; keep weight light."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Farmer's Walk",
    primary_muscle: "Forearms",
    secondary_muscles: ["Traps", "Core", "Grip", "Calves"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Pick up a pair of heavy dumbbells or kettlebells with a solid grip.",
      "Stand tall with shoulders back, chest up, and core braced.",
      "Walk forward in a straight line with small, controlled steps.",
      "Maintain upright posture without letting weights swing or torso tilt."
    ],
    common_mistakes: ["Slouching shoulders forward", "Walking too fast and losing balance", "Letting weights bang against legs"],
    safety_cautions: ["Deadlift the weights up with a flat back before walking."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },

  // ==========================================
  // CORE / ABS (9 Exercises)
  // ==========================================
  {
    name: "Hanging Leg Raises",
    primary_muscle: "Core",
    secondary_muscles: ["Hip Flexors", "Forearms", "Lower Abs"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Hang from a pull-up bar with an overhand grip and legs straight.",
      "Engage your core and raise your legs up until they are parallel to the floor (or higher).",
      "Tilt your pelvis slightly upward at the top to fully engage the rectus abdominis.",
      "Lower your legs slowly without swinging back and forth."
    ],
    common_mistakes: ["Using swinging momentum to kick legs up", "Arching the lower back on the way down"],
    safety_cautions: ["If full leg extension causes swinging, start with hanging knee raises."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Captain's Chair Knee Raises",
    primary_muscle: "Core",
    secondary_muscles: ["Hip Flexors", "Lower Abs"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Step into the captain's chair apparatus with forearms on pads and back against support.",
      "Let legs hang straight down with feet together.",
      "Drive your knees up toward your chest, rounding your lower pelvis upward.",
      "Hold the contraction at the top for a moment, then lower legs with control."
    ],
    common_mistakes: ["Dropping legs rapidly without control", "Shrugging neck into shoulders"],
    safety_cautions: ["Keep back flat against the pad throughout."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Kneeling Cable Crunch",
    primary_muscle: "Core",
    secondary_muscles: ["Upper Abs", "Obliques"],
    equipment: "Cable",
    difficulty: "Beginner",
    instructions: [
      "Attach a rope to a high pulley and kneel roughly two feet in front of the stack.",
      "Hold rope ends beside your ears/cheeks with hips locked in place.",
      "Contract your abdominal muscles to pull your elbows down toward your thighs.",
      "Pause in full contraction, then slowly extend spine back to neutral."
    ],
    common_mistakes: ["Sitting hips back onto heels (using bodyweight instead of abs)", "Pulling with the arms rather than flexing the spine"],
    safety_cautions: ["Keep hips static; the movement comes purely from spinal flexion."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Ab Wheel Rollout",
    primary_muscle: "Core",
    secondary_muscles: ["Lats", "Lower Back", "Shoulders"],
    equipment: "Bodyweight",
    difficulty: "Advanced",
    instructions: [
      "Kneel on a soft mat holding the ab roller with both hands.",
      "Tuck your pelvis and brace your core tightly.",
      "Slowly roll the wheel forward, extending your body as far as you can maintain a neutral spine.",
      "Pull through your abs and lats to return to the starting position."
    ],
    common_mistakes: ["Allowing the lower back to sag/hyperextend into lumbar pain", "Pushing hips back first instead of pulling with abs"],
    safety_cautions: ["Do not roll out further than your core strength can support without back arching."],
    rest_recommendation: "60-90 seconds",
    video_url: null
  },
  {
    name: "Plank",
    primary_muscle: "Core",
    secondary_muscles: ["Shoulders", "Glutes", "Transverse Abdominis"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Place your forearms on the ground with elbows directly under shoulders.",
      "Extend your legs behind you with toes planted.",
      "Brace your core, squeeze glutes, and maintain a straight line from head to heels.",
      "Breathe steadily and hold for the targeted duration."
    ],
    common_mistakes: ["Sagging the hips downward", "Piking hips up toward the ceiling", "Holding breath"],
    safety_cautions: ["Stop when fatigue causes your lower back to collapse."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Russian Twists",
    primary_muscle: "Core",
    secondary_muscles: ["Obliques", "Hip Flexors"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Sit on the floor with knees bent and feet elevated slightly off the floor.",
      "Lean back slightly to roughly a 45-degree angle with a flat back.",
      "Hold hands together or hold a dumbbell/medicine ball in front of your chest.",
      "Rotate your torso smoothly from side to side, touching the floor beside your hips."
    ],
    common_mistakes: ["Only moving arms instead of rotating through the thoracic spine", "Slouching the lower back"],
    safety_cautions: ["Maintain a tall spine to protect the lumbar vertebrae during rotation."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Bicycle Crunches",
    primary_muscle: "Core",
    secondary_muscles: ["Obliques", "Hip Flexors"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with hands lightly supporting your head and legs elevated.",
      "Bring one knee in toward your chest while rotating the opposite elbow toward that knee.",
      "Simultaneously extend the other leg out straight.",
      "Alternate sides in a smooth, pedaling rhythm without pulling on your neck."
    ],
    common_mistakes: ["Yanking the neck forward with hands", "Rushing through reps without twisting the torso"],
    safety_cautions: ["Keep elbows wide and initiate movement by turning your shoulders."],
    rest_recommendation: "45-60 seconds",
    video_url: null
  },
  {
    name: "Cable Woodchoppers",
    primary_muscle: "Core",
    secondary_muscles: ["Obliques", "Shoulders", "Hips"],
    equipment: "Cable",
    difficulty: "Intermediate",
    instructions: [
      "Set cable pulley to high position with a single handle.",
      "Stand sideways to the machine in a wide athletic stance.",
      "Grip handle with both hands and pull down and across your body toward the opposite knee.",
      "Pivot on your back foot and rotate through your core, then return with control."
    ],
    common_mistakes: ["Bending elbows and using arm pull instead of torso rotation", "Locking knees stiffly"],
    safety_cautions: ["Keep the movement controlled; avoid jerking the cable."],
    rest_recommendation: "60 seconds",
    video_url: null
  },
  {
    name: "Decline Bench Crunches",
    primary_muscle: "Core",
    secondary_muscles: ["Upper Abs", "Hip Flexors"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Hook your feet under the pads of a decline bench and lie back.",
      "Place hands across your chest or beside your ears.",
      "Curl your upper torso upward by contracting your abdominal muscles.",
      "Pause for 1 second at the top squeeze, then lower slowly without resting on the pad."
    ],
    common_mistakes: ["Pulling on the back of the neck", "Flop down onto the bench between reps"],
    safety_cautions: ["Maintain abdominal tension throughout the entire rep range."],
    rest_recommendation: "60 seconds",
    video_url: null
  }
];

// Generate SQL
let sql = `-- ==========================================
-- SEED EXERCISES DATA (EXPANDED LIBRARY)
-- Total exercises: ${exercises.length}
-- Idempotent: inserts only if exercise does not already exist
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
SELECT '${name}', '${primaryMuscle}', ${secondaryMuscles}, '${equipment}', '${difficulty}', '${instructions}'::jsonb, '${mistakes}'::jsonb, '${cautions}'::jsonb, '${rest}', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = '${name}' AND user_id IS NULL
);\n\n`;
});

const path = require('path');
const outPath = path.join(__dirname, 'supabase', 'seed.sql');
fs.writeFileSync(outPath, sql);
console.log('Successfully generated ' + outPath + ' with ' + exercises.length + ' exercises.');


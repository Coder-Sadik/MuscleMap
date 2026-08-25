-- ==========================================
-- SEED EXERCISES DATA (EXPANDED LIBRARY)
-- Total exercises: 77
-- Idempotent: inserts only if exercise does not already exist
-- ==========================================

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Bench Press', 'Chest', ARRAY['Triceps', 'Front Delts'], 'Barbell', 'Intermediate', '["Lie flat on the bench with your eyes directly under the racked bar.","Grip the bar slightly wider than shoulder-width with wrists straight.","Retract your shoulder blades and plant your feet firmly on the floor.","Unrack the bar and lower it with control to your mid-chest.","Press the bar back up in a slight arc toward eye level without bouncing."]'::jsonb, '["Bouncing the bar off the ribcage","Flaring elbows out at 90 degrees","Lifting glutes off the bench"]'::jsonb, '["Always use a spotter or safety pins when lifting heavy.","Keep your wrists neutral to prevent sprains."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Bench Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Incline Dumbbell Press', 'Chest', ARRAY['Upper Chest', 'Front Delts', 'Triceps'], 'Dumbbell', 'Intermediate', '["Set an adjustable bench to a 30 to 45-degree incline.","Sit back with dumbbells resting vertically on your thighs.","Kick the weights up smoothly to shoulder level one by one.","Press the dumbbells upward until arms are extended above your upper chest.","Lower under control until you feel a deep stretch across the pectorals."]'::jsonb, '["Setting the incline too high (turns into shoulder press)","Banging dumbbells together at the top","Dropping elbows too low"]'::jsonb, '["Maintain a controlled tempo on the descent to protect the pec tendon."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Incline Dumbbell Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Incline Barbell Bench Press', 'Chest', ARRAY['Upper Chest', 'Front Delts', 'Triceps'], 'Barbell', 'Intermediate', '["Lie on an incline bench angled between 30 and 45 degrees.","Grip the bar slightly wider than shoulder-width.","Unrack and lower the bar slowly to your clavicle / upper chest area.","Drive through your palms to press the bar back up to starting position."]'::jsonb, '["Lowering the bar too low onto the stomach","Arching lower back excessively off the incline pad"]'::jsonb, '["Ensure secure grip with thumb wrapped around the bar."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Incline Barbell Bench Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Decline Barbell Bench Press', 'Chest', ARRAY['Lower Chest', 'Triceps', 'Front Delts'], 'Barbell', 'Intermediate', '["Secure your legs in the decline bench pads and lie back.","Grip the bar slightly wider than shoulder-width.","Unrack and lower the barbell slowly to the lower chest line.","Press the barbell straight up until arms are fully extended."]'::jsonb, '["Letting the bar drift over the face or neck","Losing leg anchor stability"]'::jsonb, '["Always ensure legs are locked firmly in position before unracking."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Decline Barbell Bench Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Flat Dumbbell Press', 'Chest', ARRAY['Triceps', 'Front Delts'], 'Dumbbell', 'Beginner', '["Sit on a flat bench with dumbbells resting on your knees.","Lie back and kick the dumbbells up into pressing position over your chest.","Lower the dumbbells outward until elbows are slightly below bench level.","Press the dumbbells back up together, focusing on chest contraction."]'::jsonb, '["Flaring elbows excessively","Arching spine off the bench"]'::jsonb, '["Drop dumbbells outward safely to the floor only if using bumper mats."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Flat Dumbbell Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Push-ups', 'Chest', ARRAY['Triceps', 'Front Delts', 'Core'], 'Bodyweight', 'Beginner', '["Start in a high plank position with hands slightly wider than shoulder-width.","Keep your body in a straight line from head to heels with core braced.","Lower your chest until it hovers an inch above the floor.","Push forcefully through your hands to return to the top position."]'::jsonb, '["Sagging the hips","Craning the neck downward","Flaring elbows out to 90 degrees"]'::jsonb, '["Keep core tight to avoid lumbar hyperextension."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Push-ups' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Chest Dips', 'Chest', ARRAY['Triceps', 'Front Delts', 'Lower Chest'], 'Bodyweight', 'Advanced', '["Mount parallel bars and support your bodyweight with straight arms.","Lean your torso forward at roughly a 30-degree angle.","Bend your elbows and lower your body until elbows reach 90 degrees.","Press through your palms to push yourself back up to the top."]'::jsonb, '["Staying completely upright (shifts tension to triceps)","Dipping too deep into shoulder strain","Swinging legs"]'::jsonb, '["Avoid this exercise if you have pre-existing shoulder impingement."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Chest Dips' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Cable Chest Flyes', 'Chest', ARRAY['Front Delts'], 'Cable', 'Intermediate', '["Set cable pulleys at chest height with single handles attached.","Step forward into a staggered stance with a slight forward torso lean.","With elbows slightly bent, bring handles together in an arc in front of your chest.","Squeeze your chest hard at peak contraction, then open arms slowly under tension."]'::jsonb, '["Bending and extending elbows (turning it into a press)","Letting the cables pull shoulders back too fast"]'::jsonb, '["Keep a constant slight bend in the elbows to protect the biceps tendon."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Cable Chest Flyes' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Incline Cable Flyes', 'Chest', ARRAY['Upper Chest', 'Front Delts'], 'Cable', 'Intermediate', '["Set cable pulleys to the lowest position with single handles.","Stand staggered, take a step forward, and keep arms wide with slight elbow bend.","Sweep hands upward and inward in an arc toward eye level.","Squeeze upper chest at top, then lower with control."]'::jsonb, '["Using excessive momentum","Shrugging shoulders into the neck"]'::jsonb, '["Select moderate weight to maintain shoulder control."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Incline Cable Flyes' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Pec Deck Machine Flyes', 'Chest', ARRAY['Front Delts'], 'Machine', 'Beginner', '["Adjust the seat so handles or pads sit level with your mid-chest.","Rest forearms or hands against the pads and keep chest up.","Contract pectorals to bring the pads together in front of you.","Hold the squeeze for 1 second, then return smoothly."]'::jsonb, '["Letting the weight stack slam at the back","Rounding shoulders forward at full contraction"]'::jsonb, '["Do not allow the machine to hyper-extend your shoulders backward."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Pec Deck Machine Flyes' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Machine Chest Press', 'Chest', ARRAY['Triceps', 'Front Delts'], 'Machine', 'Beginner', '["Adjust the seat height so the handles align with your mid-chest.","Sit back firmly, plant feet, and grip the handles.","Press forward until arms are almost fully extended without locking elbows.","Lower under control until handles return to chest depth."]'::jsonb, '["Slouching in the seat","Locking elbows harshly at the end of the press"]'::jsonb, '["Keep head and back pressed against the pad throughout the set."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Machine Chest Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Dumbbell Pullover', 'Chest', ARRAY['Lats', 'Serratus Anterior', 'Triceps'], 'Dumbbell', 'Intermediate', '["Lie perpendicular across a flat bench with your upper back supported.","Hold a single dumbbell overhead with both hands in a diamond cup grip.","Slowly lower the dumbbell back over your head in an arc while keeping arms slightly bent.","Pull the dumbbell back up over your chest by contracting your chest and lats."]'::jsonb, '["Bending elbows too much (making it a tricep extension)","Dropping hips excessively"]'::jsonb, '["Use a secure grip; never let the weight slip above your face."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Dumbbell Pullover' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Deadlift (Conventional)', 'Back', ARRAY['Glutes', 'Hamstrings', 'Lower Back', 'Traps', 'Forearms'], 'Barbell', 'Advanced', '["Stand with mid-foot directly under the barbell, feet hip-width apart.","Hinge at the hips, bend knees, and grip bar just outside your shins.","Pull chest up, flatten your back, and engage your lats.","Drive the floor away through your heels, extending hips and knees simultaneously.","Stand tall at the top without hyperextending your lumbar spine."]'::jsonb, '["Rounding the lower back","Jerking the bar off the floor without taking the slack out","Bar drifting away from the shins"]'::jsonb, '["Never lift with a rounded spine. Keep the barbell against your legs throughout the lift."]'::jsonb, '120-180 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Deadlift (Conventional)' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Pull-ups', 'Back', ARRAY['Lats', 'Biceps', 'Rear Delts', 'Upper Back'], 'Bodyweight', 'Advanced', '["Grip the pull-up bar with an overhand grip slightly wider than shoulder-width.","Start from a full dead hang with arms extended and shoulders engaged.","Pull yourself up by driving your elbows down towards your ribs.","Continue until your chin clears the top of the bar.","Lower yourself back down with complete control."]'::jsonb, '["Kipping or swinging legs for momentum","Not completing the full range of motion at bottom"]'::jsonb, '["Warm up shoulders and rotators before heavy sets."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Pull-ups' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Chin-ups', 'Back', ARRAY['Biceps', 'Lats', 'Core'], 'Bodyweight', 'Intermediate', '["Grip the bar with an underhand (supinated) grip at shoulder-width.","Hang with arms fully extended.","Pull your body upward by engaging your back and biceps until chin is above the bar.","Lower under control back to full extension."]'::jsonb, '["Dropping down rapidly without eccentric control","Short-changing the top squeeze"]'::jsonb, '["Control the descent to avoid strain on the bicep tendon."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Chin-ups' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Row', 'Back', ARRAY['Lats', 'Rhomboids', 'Biceps', 'Lower Back'], 'Barbell', 'Intermediate', '["Stand feet hip-width apart holding a barbell with an overhand grip.","Hinge at your hips until your torso is approximately 45 degrees to the floor.","Keep spine neutral and pull the barbell to your lower ribcage / navel.","Squeeze your shoulder blades together at the top, then lower the bar with control."]'::jsonb, '["Rounding the lower back","Using torso jerking momentum","Standing too upright"]'::jsonb, '["Brace your core tight to support the lower back during the hinge."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Row' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Lat Pulldown', 'Back', ARRAY['Lats', 'Biceps', 'Rear Delts'], 'Machine', 'Beginner', '["Sit at the pulldown station and secure the thigh pads firmly.","Grip the wide bar with an overhand grip wider than shoulder-width.","Lean back slightly (10-15 degrees) and pull the bar down toward your upper chest.","Squeeze lats at the bottom, then let the bar rise back up under control."]'::jsonb, '["Pulling the bar behind the neck","Leaning back excessively to turn it into a row","Letting the stack crash"]'::jsonb, '["Never pull behind the neck to protect the cervical spine and rotator cuff."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Lat Pulldown' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Seated Cable Row', 'Back', ARRAY['Lats', 'Rhomboids', 'Biceps', 'Traps'], 'Cable', 'Beginner', '["Sit on the bench with feet on the footplates and knees slightly bent.","Grasp the V-bar handle and sit upright with a neutral spine.","Pull the handle toward your abdomen while keeping your elbows close to your sides.","Squeeze your shoulder blades together, then return slowly to the starting position."]'::jsonb, '["Excessive rocking forward and back","Rounding the lower back at the reach","Shrugging the shoulders upward"]'::jsonb, '["Keep the core engaged to prevent lumbar rounding during the stretch."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Seated Cable Row' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Single-Arm Dumbbell Row', 'Back', ARRAY['Lats', 'Rhomboids', 'Biceps', 'Rear Delts'], 'Dumbbell', 'Beginner', '["Place your left knee and left hand firmly on a flat bench.","Hold a dumbbell in your right hand with your right foot on the ground.","Keep your back flat and pull the dumbbell toward your right hip.","Pause and squeeze your lat at the top, then lower the dumbbell fully."]'::jsonb, '["Twisting the torso excessively at the top","Pulling straight up into the chest instead of towards the hip"]'::jsonb, '["Maintain a flat back throughout to protect the spine."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Single-Arm Dumbbell Row' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'T-Bar Row', 'Back', ARRAY['Middle Back', 'Lats', 'Traps', 'Biceps'], 'Barbell', 'Intermediate', '["Straddle the T-bar apparatus or landmine barbell with feet shoulder-width apart.","Hinge at the hips with a flat back and grip the handles.","Pull the weight upward toward your upper abdomen / chest.","Squeeze back muscles at top, then lower smoothly."]'::jsonb, '["Standing up too high during the pull","Rounding the spine under heavy load"]'::jsonb, '["Use 25lb / smaller plates if 45lb plates limit your range of motion."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'T-Bar Row' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Straight-Arm Cable Pulldown', 'Back', ARRAY['Lats', 'Teres Major', 'Triceps Long Head'], 'Cable', 'Beginner', '["Attach a straight or curved bar to a high cable pulley.","Step back slightly, hinge forward at hips with arms almost straight.","Pull the bar in a downward arc toward your thighs using only your lats.","Squeeze lats hard at bottom, then slowly let the bar return to eye level."]'::jsonb, '["Bending elbows and turning the exercise into a tricep pushdown","Using momentum by bobbing the torso"]'::jsonb, '["Keep a slight bend in elbows to protect joints."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Straight-Arm Cable Pulldown' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Chest-Supported Machine Row', 'Back', ARRAY['Rhomboids', 'Middle Back', 'Biceps'], 'Machine', 'Beginner', '["Adjust the seat so your chest rests firmly on the chest pad.","Reach forward, grip the handles, and keep feet planted.","Pull handles toward your ribs, driving elbows back.","Hold the contraction for a beat, then return under control."]'::jsonb, '["Letting chest lift off the support pad to cheat the weight","Rushing through the eccentric phase"]'::jsonb, '["Keep chest against the pad for full spinal protection."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Chest-Supported Machine Row' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Face Pulls', 'Back', ARRAY['Rear Delts', 'Rotator Cuff', 'Upper Traps'], 'Cable', 'Beginner', '["Attach a rope to a cable station at upper chest / face height.","Grip the rope ends with thumbs pointing backward.","Step back and pull the rope directly towards your face, separating the ends.","Rotate hands backward at the end of the pull, squeezing the rear shoulders."]'::jsonb, '["Using too much weight and pulling down to the chest","Leaning back excessively"]'::jsonb, '["Focus on external rotation and light weight for shoulder health."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Face Pulls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Shrugs', 'Back', ARRAY['Traps', 'Forearms'], 'Barbell', 'Beginner', '["Stand tall holding a barbell in front of your thighs with an overhand grip.","Elevate your shoulders directly up toward your ears in a shrugging motion.","Hold the peak contraction at the top for 1 to 2 seconds.","Lower shoulders back down under full control."]'::jsonb, '["Rolling shoulders in circles (can strain rotator cuff)","Bending elbows to assist lift"]'::jsonb, '["Only shrug vertically up and down; never roll shoulders."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Shrugs' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Hyperextensions (Back Extensions)', 'Back', ARRAY['Lower Back', 'Glutes', 'Hamstrings'], 'Bodyweight', 'Beginner', '["Position yourself on the back extension bench with hips resting on the pad.","Cross your arms over your chest or hold a weight plate.","Hinge forward at the hips, lowering your torso toward the floor.","Raise your torso back up until your body forms a straight line."]'::jsonb, '["Hyperextending the spine past neutral at the top","Jerking upward quickly"]'::jsonb, '["Stop once body is in line; avoid curving backward."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Hyperextensions (Back Extensions)' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Overhead Press', 'Shoulders', ARRAY['Front Delts', 'Triceps', 'Upper Chest', 'Core'], 'Barbell', 'Intermediate', '["Stand with feet shoulder-width apart, holding a barbell across your collarbone.","Brace your core, squeeze your glutes, and tilt your head back slightly.","Press the bar vertically overhead until arms are locked out.","Push your head forward slightly as the bar passes your forehead.","Lower the bar under control back to your upper chest."]'::jsonb, '["Excessively arching the lower back","Pushing the bar out in front rather than straight up","Using leg drive on strict press"]'::jsonb, '["Keep your core braced tight to protect the lumbar spine."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Overhead Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Seated Dumbbell Shoulder Press', 'Shoulders', ARRAY['Front Delts', 'Triceps', 'Traps'], 'Dumbbell', 'Beginner', '["Sit on an upright bench with dumbbells resting on your knees.","Kick dumbbells up to ear height with palms facing forward.","Press the weights overhead in a smooth arc until arms are extended.","Lower slowly until dumbbells return to ear / chin height."]'::jsonb, '["Arching the lower back away from the back pad","Banging dumbbells at the top"]'::jsonb, '["Keep back flat against the backrest."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Seated Dumbbell Shoulder Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Arnold Press', 'Shoulders', ARRAY['Front Delts', 'Side Delts', 'Triceps'], 'Dumbbell', 'Intermediate', '["Sit on an upright bench holding dumbbells at chin height with palms facing you.","As you press the weights up, rotate your wrists outward.","Finish the press with palms facing forward at full overhead lockout.","Reverse the rotation smoothly as you lower the weights back to the start."]'::jsonb, '["Jerking during the rotation","Using excessive weight that compromises rotator cuff control"]'::jsonb, '["Start light to master the rotational movement pattern."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Arnold Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Lateral Raises', 'Shoulders', ARRAY['Side Delts', 'Traps'], 'Dumbbell', 'Beginner', '["Stand tall holding dumbbells at your sides with a slight forward torso tilt.","With a slight bend in your elbows, raise the weights out to your sides.","Lift until your arms are parallel to the floor, leading with your elbows.","Lower the dumbbells back down slowly under full control."]'::jsonb, '["Swinging the body to create momentum","Raising weights higher than shoulder level","Shrugging traps upward"]'::jsonb, '["Avoid heavy weights that force jerking or shoulder impingement."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Lateral Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Cable Lateral Raises', 'Shoulders', ARRAY['Side Delts'], 'Cable', 'Beginner', '["Set a low pulley and stand with the cable running behind or in front of your legs.","Grip the single handle with the opposite hand.","Raise the handle out to your side until arm is parallel to the ground.","Slowly resist the cable tension on the way down."]'::jsonb, '["Using body swing to start the lift","Dropping the weight abruptly"]'::jsonb, '["Maintain a constant slight elbow bend."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Cable Lateral Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Bent-Over Dumbbell Rear Delt Flyes', 'Shoulders', ARRAY['Rear Delts', 'Rhomboids', 'Traps'], 'Dumbbell', 'Beginner', '["Hinge at the hips until your torso is nearly parallel to the floor.","Let dumbbells hang straight down with palms facing each other.","With elbows slightly bent, raise the weights out to your sides.","Squeeze your rear deltoids at the top, then lower with control."]'::jsonb, '["Standing up too straight","Using momentum from the back and legs"]'::jsonb, '["Keep neck neutral and avoid looking up excessively."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Bent-Over Dumbbell Rear Delt Flyes' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Reverse Pec Deck Flyes', 'Shoulders', ARRAY['Rear Delts', 'Rhomboids', 'Upper Back'], 'Machine', 'Beginner', '["Sit facing the pec deck machine with your chest against the pad.","Grip the horizontal handles with palms facing down or neutral.","Pull the handles out and back in a wide arc using your rear delts.","Pause briefly at peak contraction, then return slowly."]'::jsonb, '["Using momentum to slam handles back","Bending elbows excessively during the fly"]'::jsonb, '["Adjust seat height so handles sit level with your shoulders."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Reverse Pec Deck Flyes' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Dumbbell Front Raises', 'Shoulders', ARRAY['Front Delts', 'Upper Chest'], 'Dumbbell', 'Beginner', '["Stand tall holding dumbbells across the front of your thighs.","Raise one or both dumbbells straight in front of you up to shoulder height.","Hold for a split second, then lower slowly back to your thighs."]'::jsonb, '["Leaning backward to swing weights up","Raising arms higher than eye level"]'::jsonb, '["Control the descent to protect the anterior capsule."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Dumbbell Front Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Upright Rows', 'Shoulders', ARRAY['Side Delts', 'Traps', 'Biceps'], 'Barbell', 'Intermediate', '["Hold an EZ bar or barbell in front of your thighs with a shoulder-width grip.","Pull the bar vertically along your body until elbows reach shoulder height.","Keep elbows higher than your wrists throughout the movement.","Lower the bar back down with control."]'::jsonb, '["Using an excessively narrow grip (causes wrist/shoulder pinch)","Pulling the bar too high up to the chin"]'::jsonb, '["Use a wider grip to reduce internal shoulder rotation and impingement risk."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Upright Rows' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Machine Shoulder Press', 'Shoulders', ARRAY['Front Delts', 'Triceps', 'Upper Chest'], 'Machine', 'Beginner', '["Adjust the seat so handles start at shoulder height.","Sit back firmly, grip handles, and press upward smoothly.","Extend arms without locking elbows harshly.","Lower the weight back to the start under control."]'::jsonb, '["Allowing elbows to drop too far behind the torso","Arching lower back off the pad"]'::jsonb, '["Ensure seat height prevents excessive shoulder extension at bottom."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Machine Shoulder Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Squat', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings', 'Core', 'Lower Back'], 'Barbell', 'Advanced', '["Position the barbell across your upper traps and unrack it.","Stand with feet slightly wider than shoulder-width, toes angled slightly out.","Brace your core, push hips back, and bend knees to squat down.","Descend until your hip crease is at or below the top of your knees.","Drive through your mid-foot and heels to return to standing."]'::jsonb, '["Knees collapsing inward (valgus)","Rounding the lower back (butt wink)","Rising onto toes"]'::jsonb, '["Always use safety catch bars inside a power rack when squatting."]'::jsonb, '120-180 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Squat' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Front Squat', 'Legs', ARRAY['Quads', 'Glutes', 'Upper Back', 'Core'], 'Barbell', 'Advanced', '["Rack the barbell across your front deltoids with fingertips under the bar and elbows high.","Stand tall, brace core, and initiate squat by sitting down between your knees.","Maintain a vertical torso and keep elbows pointing forward throughout.","Squat to parallel or deeper, then drive straight back up."]'::jsonb, '["Dropping elbows (causes the bar to roll off)","Rounding the thoracic spine forward"]'::jsonb, '["Dump the bar forward safely onto safety pins if balance is lost."]'::jsonb, '120-180 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Front Squat' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Romanian Deadlift', 'Legs', ARRAY['Hamstrings', 'Glutes', 'Lower Back', 'Core'], 'Barbell', 'Intermediate', '["Hold a barbell at hip height with an overhand grip and knees slightly unlocked.","Hinge at the hips and push your butt backward toward the wall.","Slide the barbell down close to your shins until feeling a deep hamstring stretch.","Drive your hips forward and squeeze your glutes to return to standing."]'::jsonb, '["Bending knees into a squat","Rounding the spine","Allowing the barbell to drift away from the legs"]'::jsonb, '["Keep the bar in contact with your legs to minimize lumbar shearing."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Romanian Deadlift' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Dumbbell Romanian Deadlift', 'Legs', ARRAY['Hamstrings', 'Glutes', 'Lower Back'], 'Dumbbell', 'Beginner', '["Hold a pair of dumbbells in front of your thighs with a neutral spine.","With a soft bend in your knees, push your hips backward to lower the dumbbells.","Lower until the weights reach mid-shin level with back flat.","Squeeze glutes and extend hips to stand upright."]'::jsonb, '["Rounding the back to reach lower than mobility allows","Squatting instead of hinging"]'::jsonb, '["Maintain neutral neck alignment by looking a few feet ahead on the floor."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Dumbbell Romanian Deadlift' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Leg Press', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings'], 'Machine', 'Beginner', '["Sit on the leg press machine and place feet hip-width apart on the sled.","Release the safety levers and lower the sled slowly until knees bend to 90 degrees.","Press through your whole foot to push the platform back up.","Do not lock your knees out completely at the top of the rep."]'::jsonb, '["Locking knees backward at the top","Lowering sled too far so lower back lifts off seat pad"]'::jsonb, '["Never lock your knees into hyperextension under heavy load."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Leg Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Hack Squat', 'Legs', ARRAY['Quads', 'Glutes'], 'Machine', 'Intermediate', '["Position your back and shoulders against the hack squat pads.","Place feet shoulder-width apart in the middle of the platform.","Disengage safety levers and lower down smoothly into a deep squat.","Drive through your heels to return to the starting position."]'::jsonb, '["Lifting heels off the platform","Stopping way short of parallel depth"]'::jsonb, '["Re-engage safety handles securely before stepping off."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Hack Squat' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Bulgarian Split Squat', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings', 'Calves'], 'Dumbbell', 'Intermediate', '["Stand 2-3 feet in front of a flat bench and place the top of one foot on the bench behind you.","Hold dumbbells at your sides and brace your core.","Lower your back knee towards the floor until your front thigh is parallel to the ground.","Drive through the front heel to return to the top position."]'::jsonb, '["Front foot positioned too close to the bench","Knee caving inward on descent","Leaning too far forward"]'::jsonb, '["Master the movement with bodyweight before adding heavy dumbbells."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Bulgarian Split Squat' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Walking Lunges', 'Legs', ARRAY['Quads', 'Glutes', 'Hamstrings', 'Calves'], 'Dumbbell', 'Beginner', '["Hold dumbbells at your sides and take a long step forward.","Lower your back knee until it gently touches or hovers an inch above the floor.","Drive through the front heel and step straight into the next lunge with the opposite leg.","Keep torso upright and core engaged throughout."]'::jsonb, '["Short steps that stress the front knee","Letting the front knee collapse inward"]'::jsonb, '["Avoid slamming the back knee onto hard flooring."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Walking Lunges' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Goblet Squat', 'Legs', ARRAY['Quads', 'Glutes', 'Core'], 'Dumbbell', 'Beginner', '["Hold a single dumbbell or kettlebell vertically against your chest with both hands.","Stand with feet shoulder-width apart, toes slightly turned out.","Squat down by pushing hips back and knees out, keeping elbows inside knees.","Descend to parallel or below, then press through the floor to stand."]'::jsonb, '["Letting the weight pull your upper body forward","Knees caving inward"]'::jsonb, '["Keep the weight close to the sternum to minimize back strain."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Goblet Squat' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Leg Extensions', 'Legs', ARRAY['Quads'], 'Machine', 'Beginner', '["Adjust the machine so the pad sits on top of your lower shins and your knees align with the pivot.","Sit back firmly against the back pad and grip the side handles.","Extend your legs to lift the weight until knees are straight.","Squeeze your quadriceps at the top for 1 second, then lower with control."]'::jsonb, '["Kicking the weight up quickly with momentum","Allowing the weight stack to slam at bottom"]'::jsonb, '["Avoid this exercise or use light weight if you have acute patellar tendinitis."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Leg Extensions' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Lying Leg Curls', 'Legs', ARRAY['Hamstrings', 'Calves'], 'Machine', 'Beginner', '["Lie face down on the leg curl machine with the roller pad resting on your lower calves.","Grip the handles under the bench to keep your hips glued to the pad.","Curl your heels toward your glutes as far as comfortably possible.","Lower the weight back down slowly under tension."]'::jsonb, '["Lifting hips off the bench to assist the curl","Dropping the weight without eccentric control"]'::jsonb, '["Keep hips pressed down to isolate the hamstrings and protect the lower back."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Lying Leg Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Seated Leg Curls', 'Legs', ARRAY['Hamstrings'], 'Machine', 'Beginner', '["Sit on the machine with the thigh pad secured firmly against your legs.","Position the ankle pad behind your lower calves.","Flex your knees to pull your heels downward and under the seat.","Hold the squeeze at full contraction, then slowly extend legs back."]'::jsonb, '["Letting the thigh pad stay loose","Slouching forward during the curl"]'::jsonb, '["Fasten the lap pad snugly to prevent thigh lift."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Seated Leg Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Hip Thrusts', 'Legs', ARRAY['Glutes', 'Hamstrings', 'Core'], 'Barbell', 'Intermediate', '["Sit on the floor with your upper back resting against a sturdy flat bench.","Roll a padded barbell over your hips and plant your feet flat on the floor, shoulder-width apart.","Drive through your heels to lift your hips until your thighs and torso form a straight line.","Squeeze your glutes hard at the top with chin tucked, then lower under control."]'::jsonb, '["Hyperextending the lower back at the top","Pushing through toes instead of heels","Looking at the ceiling instead of forward"]'::jsonb, '["Always use a thick barbell pad to protect the pelvic bones."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Hip Thrusts' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Standing Calf Raises', 'Legs', ARRAY['Calves'], 'Machine', 'Beginner', '["Place your shoulders under the pads and the balls of your feet on the step edge.","Lower your heels as far as possible for a full calf stretch.","Drive through the balls of your feet to raise yourself as high as possible.","Hold peak contraction for 1 second before lowering slowly."]'::jsonb, '["Bouncing at the bottom using Achilles tendon elasticity","Bending knees to assist lift"]'::jsonb, '["Perform with a 2-second pause at the bottom stretch to prevent strain."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Standing Calf Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Seated Calf Raises', 'Legs', ARRAY['Calves', 'Soleus'], 'Machine', 'Beginner', '["Sit on the machine with thigh pad secured on top of your lower thighs.","Place balls of feet on the platform edge and release the safety pin.","Lower heels deeply to feel a stretch in the soleus.","Push up through the balls of your feet to full plantarflexion, hold, then lower."]'::jsonb, '["Fast bouncing without full stretch","Incomplete range of motion at the top"]'::jsonb, '["Lock the safety pin securely when finished."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Seated Calf Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Bicep Curls', 'Biceps', ARRAY['Forearms', 'Brachialis'], 'Dumbbell', 'Beginner', '["Stand holding a dumbbell in each hand with palms facing forward.","Keep upper arms pinned to your sides and curl the dumbbells toward your shoulders.","Squeeze your biceps tightly at the top of the curl.","Lower the weights slowly back down to full arm extension."]'::jsonb, '["Swinging the body for momentum","Letting elbows drift forward excessively","Not fully extending at the bottom"]'::jsonb, '["Use controlled cadence to protect the distal bicep tendon."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Bicep Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Bicep Curls', 'Biceps', ARRAY['Forearms', 'Brachialis'], 'Barbell', 'Beginner', '["Stand tall holding a barbell with an underhand grip shoulder-width apart.","Keep your core braced and elbows tucked against your ribcage.","Curl the barbell upward in a smooth arc toward your upper chest.","Squeeze your biceps at the top, then lower the bar with control."]'::jsonb, '["Leaning backward to cheat the weight up","Short-changing the bottom stretch"]'::jsonb, '["Use an EZ bar if straight barbell causes wrist or elbow strain."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Bicep Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Incline Dumbbell Curls', 'Biceps', ARRAY['Biceps Long Head', 'Forearms'], 'Dumbbell', 'Intermediate', '["Sit back on an incline bench set to roughly 45 to 60 degrees.","Let your arms hang straight down toward the floor with dumbbells.","Curl the weights upward while keeping your upper arms stationary.","Squeeze biceps at the top, then lower with control into a full long-head stretch."]'::jsonb, '["Swinging the arms forward","Lifting shoulders off the bench pad"]'::jsonb, '["Do not use excessive weight; the stretched position requires strict control."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Incline Dumbbell Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Hammer Curls', 'Biceps', ARRAY['Brachialis', 'Brachioradialis', 'Forearms'], 'Dumbbell', 'Beginner', '["Stand holding dumbbells at your sides with palms facing each other (neutral grip).","Keep upper arms still and curl the dumbbells toward your shoulders.","Squeeze the brachialis and forearm at the top of the curl.","Lower the dumbbells slowly back down to starting position."]'::jsonb, '["Using torso momentum","Rotating the wrists (keep neutral throughout)"]'::jsonb, '["Maintain a firm grip to prevent wrist deflection."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Hammer Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Preacher Curls', 'Biceps', ARRAY['Biceps Short Head', 'Forearms'], 'EZ Bar', 'Intermediate', '["Sit at a preacher bench and rest the back of your upper arms flat against the pad.","Grip the inner curves of an EZ curl bar with an underhand grip.","Curl the bar upward toward your chin until biceps are fully contracted.","Lower the bar slowly until arms are extended (stop just short of hyperextending)."]'::jsonb, '["Lifting elbows off the pad","Hyperextending elbows abruptly at the bottom"]'::jsonb, '["Never bounce the bar at full extension; maintain bicep tension to protect tendons."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Preacher Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Concentration Curls', 'Biceps', ARRAY['Forearms'], 'Dumbbell', 'Beginner', '["Sit on the edge of a bench with legs open and hold a dumbbell in one hand.","Press the back of your upper arm against the inside of your same-side thigh.","Curl the dumbbell upward toward your face while keeping the arm locked in place.","Squeeze at the top, then slowly lower to the start position."]'::jsonb, '["Using leg movement to bounce the weight","Curling with a loose wrist"]'::jsonb, '["Focus on mind-muscle connection and light-to-moderate load."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Concentration Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Cable Bicep Curls', 'Biceps', ARRAY['Forearms'], 'Cable', 'Beginner', '["Attach a straight or EZ bar to the bottom pulley of a cable machine.","Stand a step back and grip the bar with an underhand grip.","Curl the bar upward while maintaining continuous cable tension.","Squeeze at the peak, then lower the bar with control."]'::jsonb, '["Stepping too close or too far from the pulley","Allowing elbows to flare outward"]'::jsonb, '["Keep spine neutral and core braced throughout."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Cable Bicep Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Spider Curls', 'Biceps', ARRAY['Biceps Short Head', 'Brachialis'], 'Dumbbell', 'Intermediate', '["Lie face down on a 45-degree incline bench with your chest supported.","Let your arms hang straight down perpendicular to the floor holding dumbbells.","Curl the dumbbells upward without allowing upper arms to swing back.","Squeeze peak contraction at the top, then lower with control."]'::jsonb, '["Swinging elbows backward toward hips","Rushing through the bottom stretch"]'::jsonb, '["Keep chest firmly against pad to eliminate momentum."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Spider Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Tricep Pushdowns', 'Triceps', ARRAY['Forearms'], 'Machine', 'Beginner', '["Attach a rope or straight bar to a high cable pulley.","Stand with feet shoulder-width apart, elbows pinned to your sides.","Push the attachment down until arms are fully locked out at bottom.","Squeeze triceps hard, then return slowly to 90-degree elbow bend."]'::jsonb, '["Letting elbows flare out or drift forward and backward","Using bodyweight to press down"]'::jsonb, '["Keep wrists straight and avoid hyperextending shoulders."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Tricep Pushdowns' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Skull Crushers (Lying Tricep Extensions)', 'Triceps', ARRAY['Forearms', 'Chest'], 'EZ Bar', 'Intermediate', '["Lie on a flat bench holding an EZ bar with an overhand grip above your chest.","Keep upper arms angled slightly back toward your head (around 75 degrees).","Bend elbows to lower the bar toward your forehead / top of head.","Extend your elbows smoothly to press the bar back up to the start."]'::jsonb, '["Flaring elbows out to the sides","Allowing upper arms to move forward and back"]'::jsonb, '["Control the descent carefully so the bar does not hit your face or forehead."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Skull Crushers (Lying Tricep Extensions)' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Overhead Dumbbell Tricep Extension', 'Triceps', ARRAY['Triceps Long Head', 'Core'], 'Dumbbell', 'Beginner', '["Sit or stand tall holding a single dumbbell with both hands overhead in a diamond cup grip.","Keep elbows pointing forward and upper arms close to your ears.","Lower the dumbbell behind your head by bending your elbows.","Press the dumbbell back overhead until arms are extended."]'::jsonb, '["Flaring elbows wide to the sides","Arching lower back excessively"]'::jsonb, '["Secure the dumbbell firmly between palms to prevent slipping."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Overhead Dumbbell Tricep Extension' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Overhead Cable Tricep Extension', 'Triceps', ARRAY['Triceps Long Head'], 'Cable', 'Beginner', '["Attach a rope to a cable pulley at waist or head height and turn away in a staggered stance.","Hold the rope behind your head with elbows bent.","Extend your arms forward and overhead, pulling the rope ends apart at lockout.","Slowly allow hands to return behind your head for a deep tricep stretch."]'::jsonb, '["Letting the cable pull your torso backward","Dropping elbows during the extension"]'::jsonb, '["Keep a firm staggered base to maintain balance."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Overhead Cable Tricep Extension' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Close-Grip Barbell Bench Press', 'Triceps', ARRAY['Chest', 'Front Delts'], 'Barbell', 'Intermediate', '["Lie on a flat bench and grip the barbell with hands shoulder-width apart (not too narrow).","Unrack the bar and lower it under control to your lower chest/sternum.","Keep elbows tucked close to your ribs on the descent.","Press the barbell back up by engaging your triceps."]'::jsonb, '["Gripping the bar with hands touching (wrecks wrists and elbows)","Flaring elbows out"]'::jsonb, '["A shoulder-width grip is optimal to protect wrists and isolate triceps."]'::jsonb, '90-120 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Close-Grip Barbell Bench Press' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Tricep Dips (Bench Dips)', 'Triceps', ARRAY['Front Delts', 'Chest'], 'Bodyweight', 'Beginner', '["Sit on the edge of a bench and place hands next to your hips with fingers forward.","Walk feet out and slide your glutes off the bench edge.","Bend elbows to lower hips toward the floor until elbows reach 90 degrees.","Press through your palms to return to full arm extension."]'::jsonb, '["Dipping too low into internal shoulder rotation","Allowing hips to drift far from the bench"]'::jsonb, '["Keep your back close to the bench to minimize shoulder strain."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Tricep Dips (Bench Dips)' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Single-Arm Cable Kickbacks', 'Triceps', ARRAY['Rear Delts'], 'Cable', 'Beginner', '["Set cable to chest height without attachment (grip rubber ball or handle).","Hinge forward at hips and pin your upper arm parallel to your torso.","Extend your arm straight back until tricep is fully contracted.","Pause for a peak squeeze, then return smoothly."]'::jsonb, '["Dropping the elbow during the kickback","Using swing momentum"]'::jsonb, '["Keep the upper arm stationary throughout the set."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Single-Arm Cable Kickbacks' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Barbell Wrist Curls', 'Forearms', ARRAY['Grip'], 'Barbell', 'Beginner', '["Sit on a bench resting your forearms on your thighs with wrists hanging over knees, palms facing up.","Hold a light barbell with fingertips and curl your wrists upward.","Squeeze forearms at the top, then lower the bar down slowly, opening fingers slightly.","Curl fingers and wrists back up."]'::jsonb, '["Using too much weight causing wrist pain","Lifting forearms off the thighs"]'::jsonb, '["Use light weight and controlled tempo to protect wrist joints."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Barbell Wrist Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Reverse Wrist Curls', 'Forearms', ARRAY['Wrist Extensors'], 'Barbell', 'Beginner', '["Rest forearms on your thighs or a flat bench with wrists over the edge, palms facing down.","Hold a light barbell and curl your wrists upward as high as possible.","Hold the contraction for 1 second, then lower with control."]'::jsonb, '["Jerking the weight","Lifting the forearms off support"]'::jsonb, '["Wrist extensors are small muscles; keep weight light."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Reverse Wrist Curls' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Farmer''s Walk', 'Forearms', ARRAY['Traps', 'Core', 'Grip', 'Calves'], 'Dumbbell', 'Intermediate', '["Pick up a pair of heavy dumbbells or kettlebells with a solid grip.","Stand tall with shoulders back, chest up, and core braced.","Walk forward in a straight line with small, controlled steps.","Maintain upright posture without letting weights swing or torso tilt."]'::jsonb, '["Slouching shoulders forward","Walking too fast and losing balance","Letting weights bang against legs"]'::jsonb, '["Deadlift the weights up with a flat back before walking."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Farmer''s Walk' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Hanging Leg Raises', 'Core', ARRAY['Hip Flexors', 'Forearms', 'Lower Abs'], 'Bodyweight', 'Advanced', '["Hang from a pull-up bar with an overhand grip and legs straight.","Engage your core and raise your legs up until they are parallel to the floor (or higher).","Tilt your pelvis slightly upward at the top to fully engage the rectus abdominis.","Lower your legs slowly without swinging back and forth."]'::jsonb, '["Using swinging momentum to kick legs up","Arching the lower back on the way down"]'::jsonb, '["If full leg extension causes swinging, start with hanging knee raises."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Hanging Leg Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Captain''s Chair Knee Raises', 'Core', ARRAY['Hip Flexors', 'Lower Abs'], 'Bodyweight', 'Beginner', '["Step into the captain''s chair apparatus with forearms on pads and back against support.","Let legs hang straight down with feet together.","Drive your knees up toward your chest, rounding your lower pelvis upward.","Hold the contraction at the top for a moment, then lower legs with control."]'::jsonb, '["Dropping legs rapidly without control","Shrugging neck into shoulders"]'::jsonb, '["Keep back flat against the pad throughout."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Captain''s Chair Knee Raises' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Kneeling Cable Crunch', 'Core', ARRAY['Upper Abs', 'Obliques'], 'Cable', 'Beginner', '["Attach a rope to a high pulley and kneel roughly two feet in front of the stack.","Hold rope ends beside your ears/cheeks with hips locked in place.","Contract your abdominal muscles to pull your elbows down toward your thighs.","Pause in full contraction, then slowly extend spine back to neutral."]'::jsonb, '["Sitting hips back onto heels (using bodyweight instead of abs)","Pulling with the arms rather than flexing the spine"]'::jsonb, '["Keep hips static; the movement comes purely from spinal flexion."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Kneeling Cable Crunch' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Ab Wheel Rollout', 'Core', ARRAY['Lats', 'Lower Back', 'Shoulders'], 'Bodyweight', 'Advanced', '["Kneel on a soft mat holding the ab roller with both hands.","Tuck your pelvis and brace your core tightly.","Slowly roll the wheel forward, extending your body as far as you can maintain a neutral spine.","Pull through your abs and lats to return to the starting position."]'::jsonb, '["Allowing the lower back to sag/hyperextend into lumbar pain","Pushing hips back first instead of pulling with abs"]'::jsonb, '["Do not roll out further than your core strength can support without back arching."]'::jsonb, '60-90 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Ab Wheel Rollout' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Plank', 'Core', ARRAY['Shoulders', 'Glutes', 'Transverse Abdominis'], 'Bodyweight', 'Beginner', '["Place your forearms on the ground with elbows directly under shoulders.","Extend your legs behind you with toes planted.","Brace your core, squeeze glutes, and maintain a straight line from head to heels.","Breathe steadily and hold for the targeted duration."]'::jsonb, '["Sagging the hips downward","Piking hips up toward the ceiling","Holding breath"]'::jsonb, '["Stop when fatigue causes your lower back to collapse."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Plank' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Russian Twists', 'Core', ARRAY['Obliques', 'Hip Flexors'], 'Bodyweight', 'Beginner', '["Sit on the floor with knees bent and feet elevated slightly off the floor.","Lean back slightly to roughly a 45-degree angle with a flat back.","Hold hands together or hold a dumbbell/medicine ball in front of your chest.","Rotate your torso smoothly from side to side, touching the floor beside your hips."]'::jsonb, '["Only moving arms instead of rotating through the thoracic spine","Slouching the lower back"]'::jsonb, '["Maintain a tall spine to protect the lumbar vertebrae during rotation."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Russian Twists' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Bicycle Crunches', 'Core', ARRAY['Obliques', 'Hip Flexors'], 'Bodyweight', 'Beginner', '["Lie on your back with hands lightly supporting your head and legs elevated.","Bring one knee in toward your chest while rotating the opposite elbow toward that knee.","Simultaneously extend the other leg out straight.","Alternate sides in a smooth, pedaling rhythm without pulling on your neck."]'::jsonb, '["Yanking the neck forward with hands","Rushing through reps without twisting the torso"]'::jsonb, '["Keep elbows wide and initiate movement by turning your shoulders."]'::jsonb, '45-60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Bicycle Crunches' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Cable Woodchoppers', 'Core', ARRAY['Obliques', 'Shoulders', 'Hips'], 'Cable', 'Intermediate', '["Set cable pulley to high position with a single handle.","Stand sideways to the machine in a wide athletic stance.","Grip handle with both hands and pull down and across your body toward the opposite knee.","Pivot on your back foot and rotate through your core, then return with control."]'::jsonb, '["Bending elbows and using arm pull instead of torso rotation","Locking knees stiffly"]'::jsonb, '["Keep the movement controlled; avoid jerking the cable."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Cable Woodchoppers' AND user_id IS NULL
);

INSERT INTO exercises (name, primary_muscle, secondary_muscles, equipment, difficulty, instructions, common_mistakes, safety_cautions, rest_recommendation, user_id)
SELECT 'Decline Bench Crunches', 'Core', ARRAY['Upper Abs', 'Hip Flexors'], 'Bodyweight', 'Beginner', '["Hook your feet under the pads of a decline bench and lie back.","Place hands across your chest or beside your ears.","Curl your upper torso upward by contracting your abdominal muscles.","Pause for 1 second at the top squeeze, then lower slowly without resting on the pad."]'::jsonb, '["Pulling on the back of the neck","Flop down onto the bench between reps"]'::jsonb, '["Maintain abdominal tension throughout the entire rep range."]'::jsonb, '60 seconds', NULL
WHERE NOT EXISTS (
    SELECT 1 FROM exercises WHERE name = 'Decline Bench Crunches' AND user_id IS NULL
);


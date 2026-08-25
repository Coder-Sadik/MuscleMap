-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger to create profile automatically on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. MUSCLES TABLE
-- ==========================================
CREATE TABLE muscles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE muscles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Muscles are viewable by everyone."
    ON muscles FOR SELECT
    USING (true);
-- (Only admins should be able to insert/update, so we don't provide rules for it here)


-- ==========================================
-- 3. EXERCISES TABLE
-- ==========================================
CREATE TABLE exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL means global system exercise
    muscle_id UUID REFERENCES muscles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view system exercises and their own custom exercises."
    ON exercises FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom exercises."
    ON exercises FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom exercises."
    ON exercises FOR UPDATE
    USING (auth.uid() = user_id);
    
CREATE POLICY "Users can delete their own custom exercises."
    ON exercises FOR DELETE
    USING (auth.uid() = user_id);


-- ==========================================
-- 4. WORKOUT ROUTINES TABLE
-- ==========================================
CREATE TABLE workout_routines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE workout_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own routines."
    ON workout_routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routines."
    ON workout_routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routines."
    ON workout_routines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routines."
    ON workout_routines FOR DELETE
    USING (auth.uid() = user_id);


-- ==========================================
-- 5. ROUTINE EXERCISES TABLE
-- ==========================================
CREATE TABLE routine_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    routine_id UUID REFERENCES workout_routines(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL,
    target_sets INTEGER NOT NULL DEFAULT 3,
    target_reps INTEGER NOT NULL DEFAULT 10,
    rest_seconds INTEGER NOT NULL DEFAULT 60
);

ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;

-- We join against workout_routines to ensure the user owns the parent routine
CREATE POLICY "Users can view routine exercises for their routines."
    ON routine_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_routines
            WHERE workout_routines.id = routine_exercises.routine_id
            AND workout_routines.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage routine exercises for their routines."
    ON routine_exercises FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workout_routines
            WHERE workout_routines.id = routine_exercises.routine_id
            AND workout_routines.user_id = auth.uid()
        )
    );


-- ==========================================
-- 6. WORKOUT LOGS TABLE
-- ==========================================
CREATE TABLE workout_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    routine_id UUID REFERENCES workout_routines(id) ON DELETE SET NULL, -- They might log an ad-hoc workout
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    -- JSONB to store array of exercises, sets, reps, weight to avoid heavy joins on mobile
    exercises_data JSONB DEFAULT '[]'::jsonb NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workout logs."
    ON workout_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs."
    ON workout_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout logs."
    ON workout_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs."
    ON workout_logs FOR DELETE
    USING (auth.uid() = user_id);


-- ==========================================
-- 7. BODY METRICS TABLE
-- ==========================================
CREATE TABLE body_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    weight_kg NUMERIC(5, 2),
    body_fat_percentage NUMERIC(5, 2),
    notes TEXT,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own body metrics."
    ON body_metrics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own body metrics."
    ON body_metrics FOR ALL
    USING (auth.uid() = user_id);


-- ==========================================
-- 8. NUTRITION TIPS TABLE
-- ==========================================
CREATE TABLE nutrition_tips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE nutrition_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nutrition tips are viewable by everyone."
    ON nutrition_tips FOR SELECT
    USING (true);
-- No insert/update rules, handled manually or by admins


-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_muscle_id ON exercises(muscle_id);
CREATE INDEX idx_workout_routines_user_id ON workout_routines(user_id);
CREATE INDEX idx_routine_exercises_routine_id ON routine_exercises(routine_id);
CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
CREATE INDEX idx_body_metrics_user_id_date ON body_metrics(user_id, recorded_date);

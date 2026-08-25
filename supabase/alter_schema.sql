-- ==========================================
-- UPDATE EXERCISES TABLE SCHEMA
-- ==========================================
-- This script adds the detailed columns required for the Exercise Library.

-- Add new columns
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS primary_muscle TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[];
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS difficulty TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS instructions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS common_mistakes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS safety_cautions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS rest_recommendation TEXT;

-- We can drop the old muscle_id foreign key if we are moving to the text-based primary_muscle system for easier filtering
-- (Optional, but recommended based on the implementation plan)
ALTER TABLE exercises DROP COLUMN IF EXISTS muscle_id;

-- Ensure the new primary_muscle column is indexed for fast filtering
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscle ON exercises(primary_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);

-- ==========================================
-- UPDATE ROUTINE EXERCISES TABLE SCHEMA
-- ==========================================
ALTER TABLE routine_exercises ADD COLUMN IF NOT EXISTS target_weight_kg NUMERIC(6,2);

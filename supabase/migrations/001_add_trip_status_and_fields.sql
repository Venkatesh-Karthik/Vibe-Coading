-- Migration: Add status and additional fields to trips table
-- This migration adds fields needed for trip cards display

-- Add status field to trips table
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS status text 
  CHECK (status IN ('planning', 'active', 'completed'))
  DEFAULT 'planning';

-- Add description field for trip details
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS description text;

-- Add is_public field to control visibility in explore page
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Add budget field for expense tracking reference
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS budget numeric DEFAULT 0;

-- Add cover_image field for trip cards
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS cover_image text;

-- Update RLS policy to allow public trips to be visible
-- Drop existing policy and recreate with public access
DROP POLICY IF EXISTS "Users can read trips they are members of" ON trips;

CREATE POLICY "Users can read trips they are members of or public trips"
  ON trips FOR SELECT
  USING (
    is_public = true OR
    auth.uid() = organizer_id OR
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Comment explaining the status field
COMMENT ON COLUMN trips.status IS 'Trip status: planning (not started), active (ongoing), completed (finished)';
COMMENT ON COLUMN trips.is_public IS 'Whether the trip is visible in the explore page';
COMMENT ON COLUMN trips.budget IS 'Estimated or total budget for the trip';

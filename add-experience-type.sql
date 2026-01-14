-- Add experience_type column to resumes table
ALTER TABLE resumes 
ADD COLUMN IF NOT EXISTS experience_type TEXT DEFAULT 'work' 
CHECK (experience_type IN ('work', 'project'));

-- Update existing resumes to have 'work' as default
UPDATE resumes 
SET experience_type = 'work' 
WHERE experience_type IS NULL;

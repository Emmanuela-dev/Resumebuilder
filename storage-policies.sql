-- Supabase Storage Policies for Certificate Uploads
-- Run this in your Supabase SQL Editor after creating the 'certificate' bucket

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own certificates" ON storage.objects;

-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Users can upload own certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificate');

-- Policy 2: Allow anyone to view certificates (for public resume sharing)
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificate');

-- Policy 3: Allow authenticated users to delete files
CREATE POLICY "Users can delete own certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificate');

-- Policy 4: Allow authenticated users to update files
CREATE POLICY "Users can update own certificates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificate');

-- Confirm all existing unconfirmed users
-- Run this in your Supabase SQL Editor to allow existing users to login

UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE 
  email_confirmed_at IS NULL 
  AND confirmed_at IS NULL;

-- Verify the update
SELECT 
  id, 
  email, 
  email_confirmed_at, 
  confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC;

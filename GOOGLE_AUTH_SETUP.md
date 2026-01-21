# Google OAuth Setup Guide

Follow these steps to enable Google sign-in for your resume builder app.

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Select **Web application**
   - Add a name (e.g., "Resume Builder")
   
5. Add Authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production URL (e.g., `https://yourdomain.com`)

6. Add Authorized redirect URIs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your actual Supabase project reference

7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## 2. Configure Supabase

1. Open your Supabase Dashboard
2. Go to **Authentication** > **Providers**
3. Find **Google** in the list and click to expand
4. Toggle **Enable Sign in with Google** to ON
5. Paste your **Client ID** and **Client Secret** from Google
6. Click **Save**

## 3. Test the Integration

1. Run your app locally: `npm run dev`
2. Go to the Register or Login page
3. Click **Continue with Google**
4. Sign in with your Google account
5. You should be redirected to the dashboard

## Troubleshooting

### "redirect_uri_mismatch" error
- Make sure you added the correct Supabase callback URL to your Google OAuth credentials
- The URL format is: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### Users not appearing in database
- Check that your `profiles` table has a trigger to auto-create profiles for new users
- Add this trigger in Supabase SQL Editor if missing:

```sql
-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Features Added

✅ Google sign-in on Register page
✅ Google sign-in on Login page  
✅ Auto-redirect to dashboard after successful authentication
✅ Clean UI with Google branding
✅ Error handling for failed authentication

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for sensitive data in production
- Keep your OAuth credentials secure
- Regularly rotate secrets if compromised

# Supabase Storage Setup for Resume Builder

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **Storage** in the left sidebar
4. Click **New Bucket**
5. Configure the bucket:
   - **Name**: `certificates`
   - **Public bucket**: ✅ Enable (so certificates can be viewed)
   - Click **Create bucket**

## Step 2: Set Up Storage Policies

After creating the bucket, set up Row Level Security policies:

### 2.1 Navigate to Policies
1. Click on the `certificates` bucket
2. Go to **Policies** tab
3. Click **New Policy**

### 2.2 Create Upload Policy
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload own certificates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 2.3 Create Read Policy (Public Access)
```sql
-- Allow anyone to read files (for public resume sharing)
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');
```

### 2.4 Create Delete Policy
```sql
-- Allow users to delete their own files
CREATE POLICY "Users can delete own certificates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

## Step 3: File Organization

Files will be organized by user:
```
certificates/
  ├── {user_id}/
  │   ├── 1234567890-abc123.pdf
  │   ├── 1234567891-def456.jpg
  │   └── ...
```

## Step 4: Supported File Types

- **PDF**: `.pdf`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`
- **Max size**: 5MB per file

## Step 5: Verify Setup

1. Go to Storage → certificates bucket
2. You should see policies listed
3. Try uploading a certificate from the app
4. Check that the file appears in the bucket

## Troubleshooting

### Upload fails with "Access Denied"
- Verify the bucket is public
- Check that policies are created correctly
- Ensure user is authenticated

### Files not visible
- Check bucket is set to public
- Verify the public read policy is active

### Large files fail
- Default limit is 5MB
- Can be increased in storage settings if needed

## Next Steps

The app will now:
1. Upload certificate files to Supabase Storage
2. Store the public URL in the `credential_url` field
3. Display uploaded certificates with preview
4. Allow downloading/viewing certificates

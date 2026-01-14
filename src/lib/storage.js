import { supabase } from './supabase';
import toast from 'react-hot-toast';

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The path within the bucket
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export const uploadFile = async (file, bucket = 'certificate', path = '') => {
  try {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} url - The public URL of the file
 * @param {string} bucket - The storage bucket name
 */
export const deleteFile = async (url, bucket = 'certificate') => {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) return;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw - file deletion failure shouldn't block other operations
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if URL is a certificate file
 */
export const isCertificateFile = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop().toLowerCase();
  return ['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(ext);
};

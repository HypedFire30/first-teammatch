import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// File upload utility for Supabase Storage
export async function uploadFile(
  file: File,
  bucket: string = 'resumes',
  folder: string = 'student-resumes'
): Promise<{ filePath: string | null; error: string | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return { filePath: null, error: error.message }
    }

    return { filePath: data.path, error: null }
  } catch (error: any) {
    console.error('File upload error:', error)
    return { filePath: null, error: error.message }
  }
}

// Get public URL for uploaded file
export function getFileUrl(filePath: string, bucket: string = 'resumes'): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

// Delete file from Supabase Storage
export async function deleteFile(
  filePath: string,
  bucket: string = 'resumes'
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.error('File deletion error:', error)
    return { error: error.message }
  }
}

// Test storage bucket connection
export async function testStorageBucket(bucket: string = 'resumes'): Promise<{ success: boolean; error?: string; files?: any[] }> {
  try {
    // Try to list files in the bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Storage bucket test error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, files: data }
  } catch (error: any) {
    console.error('Storage bucket test error:', error)
    return { success: false, error: error.message }
  }
} 
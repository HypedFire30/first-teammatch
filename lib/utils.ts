import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { storage } from "./firebase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// File upload utility for Firebase Storage
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

    // Upload file to Firebase Storage
    const storageRef = ref(storage, filePath)
    await uploadBytes(storageRef, file)

    return { filePath, error: null }
  } catch (error: any) {
    console.error('File upload error:', error)
    return { filePath: null, error: error.message }
  }
}

// Get public URL for uploaded file
export async function getFileUrl(filePath: string, bucket: string = 'resumes'): Promise<string> {
  try {
    const storageRef = ref(storage, filePath)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error: any) {
    console.error('Error getting file URL:', error)
    return ''
  }
}

// Delete file from Firebase Storage
export async function deleteFile(
  filePath: string,
  bucket: string = 'resumes'
): Promise<{ error: string | null }> {
  try {
    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)

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
    const storageRef = ref(storage, bucket)
    const result = await listAll(storageRef)

    return { success: true, files: result.items.map(item => ({ name: item.name, fullPath: item.fullPath })) }
  } catch (error: any) {
    console.error('Storage bucket test error:', error)
    return { success: false, error: error.message }
  }
}

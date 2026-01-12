/**
 * Helper functions for Supabase Storage operations
 */

import { supabase } from '../supabase'

const MEMORIES_BUCKET = 'memories'

export interface UploadResult {
  success: boolean
  publicUrl?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 * @param file File to upload
 * @param tripId Trip ID for organizing files
 * @returns Upload result with public URL or error
 */
export async function uploadMemory(file: File, tripId: string): Promise<UploadResult> {
  try {
    // Generate unique file name
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${tripId}/${timestamp}_${sanitizedFileName}`

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: uploadError.message
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(MEMORIES_BUCKET)
      .getPublicUrl(fileName)

    return {
      success: true,
      publicUrl
    }
  } catch (error) {
    console.error('Unexpected upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl Public URL of the file to delete
 * @returns Success status
 */
export async function deleteMemory(fileUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split(`/${MEMORIES_BUCKET}/`)
    if (urlParts.length < 2) {
      console.error('Invalid file URL format')
      return false
    }
    
    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from(MEMORIES_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected delete error:', error)
    return false
  }
}

/**
 * Get file type from file or MIME type
 * @param file File or MIME type string
 * @returns 'image' or 'video'
 */
export function getFileType(file: File | string): 'image' | 'video' {
  const mimeType = typeof file === 'string' ? file : file.type
  
  if (mimeType.startsWith('video/')) {
    return 'video'
  }
  
  return 'image'
}

/**
 * Validate file before upload
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Validation result
 */
export function validateFile(file: File, maxSizeMB: number = 50): { valid: boolean; error?: string } {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024)
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    }
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only images and videos are allowed.'
    }
  }

  return { valid: true }
}

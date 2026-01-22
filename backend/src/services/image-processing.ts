/**
 * Image Processing Service
 * 
 * Handles image resizing and thumbnail generation for construction photos.
 * Uses Sharp for high-performance image processing.
 * 
 * @module services/image-processing
 */

import sharp from 'sharp';

export interface ImageSize {
  width: number;
  height: number;
}

export interface ProcessedImage {
  original: Buffer;
  thumbnail?: Buffer;
  medium?: Buffer;
}

/**
 * Process image: generate thumbnails and medium-sized versions.
 * 
 * @param imageBuffer - Original image buffer
 * @param thumbnailSize - Thumbnail dimensions (default: 200x200)
 * @param mediumSize - Medium size dimensions (default: 800x600)
 * @returns Promise resolving to processed images
 */
export async function processImage(
  imageBuffer: Buffer,
  thumbnailSize: ImageSize = { width: 200, height: 200 },
  mediumSize: ImageSize = { width: 800, height: 600 }
): Promise<ProcessedImage> {
  const original = imageBuffer;

  // Generate thumbnail (square, cropped to center)
  const thumbnail = await sharp(imageBuffer)
    .resize(thumbnailSize.width, thumbnailSize.height, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 85 })
    .toBuffer();

  // Generate medium size (maintain aspect ratio)
  const medium = await sharp(imageBuffer)
    .resize(mediumSize.width, mediumSize.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toBuffer();

  return {
    original,
    thumbnail,
    medium,
  };
}

/**
 * Extract GPS coordinates from image EXIF data (if available).
 * 
 * @param imageBuffer - Image buffer
 * @returns Promise resolving to GPS coordinates or null
 */
export async function extractGPS(imageBuffer: Buffer): Promise<{ lat: number; lng: number } | null> {
  try {
    const metadata = await sharp(imageBuffer).metadata();
    const exif = metadata.exif;

    if (!exif) return null;

    // Parse EXIF GPS data (simplified - full implementation would parse binary EXIF)
    // For production, use a library like 'exif-parser' or 'piexifjs'
    // This is a stub that returns null - implement full EXIF parsing as needed

    return null;
  } catch (error) {
    console.warn('[ImageProcessing] Failed to extract GPS from image:', error);
    return null;
  }
}

/**
 * Validate image file.
 * 
 * @param buffer - Image buffer
 * @param maxSizeMB - Maximum file size in MB (default: 10MB)
 * @returns Promise resolving to validation result
 */
export async function validateImage(buffer: Buffer, maxSizeMB = 10): Promise<{ valid: boolean; error?: string }> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (buffer.length > maxSizeBytes) {
    return { valid: false, error: `Image exceeds maximum size of ${maxSizeMB}MB` };
  }

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format || !['jpeg', 'jpg', 'png', 'webp'].includes(metadata.format)) {
      return { valid: false, error: 'Invalid image format. Supported: JPEG, PNG, WebP' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid image file' };
  }
}




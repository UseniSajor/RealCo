/**
 * AWS S3 Storage Service
 * 
 * Handles file uploads to S3-compatible storage for construction photos,
 * documents, and other project assets.
 * 
 * @module services/s3
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string; // For S3-compatible services (e.g., DigitalOcean Spaces)
}

/**
 * Initialize S3 client from environment variables.
 */
function getS3Client(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';
  const endpoint = process.env.AWS_S3_ENDPOINT;

  if (!accessKeyId || !secretAccessKey) {
    console.warn('[S3] AWS credentials not configured. S3 operations will be disabled.');
    return null;
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(endpoint && { endpoint }),
  });
}

const s3Client = getS3Client();
const bucketName = process.env.AWS_S3_BUCKET_CONSTRUCTION || 'realco-construction';

/**
 * Upload a file to S3.
 * 
 * In development, if S3 is not configured, returns a mock URL.
 * 
 * @param key - S3 object key (path)
 * @param body - File buffer or stream
 * @param contentType - MIME type (e.g., 'image/jpeg')
 * @returns Promise resolving to S3 object URL
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  if (!s3Client) {
    if (process.env.NODE_ENV === 'development') {
      // Return mock URL in development
      console.warn(`[S3] Mock upload: ${key} (S3 not configured)`);
      return `https://mock-s3.local/${key}`;
    }
    throw new Error('S3 client not configured. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return public URL (adjust based on your S3 setup)
  const publicUrl = process.env.AWS_S3_PUBLIC_URL
    ? `${process.env.AWS_S3_PUBLIC_URL}/${key}`
    : `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

  return publicUrl;
}

/**
 * Generate a presigned URL for uploading (client-side uploads).
 * 
 * @param key - S3 object key
 * @param contentType - MIME type
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns Promise resolving to presigned URL
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  if (!s3Client) {
    throw new Error('S3 client not configured.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading (private files).
 * 
 * @param key - S3 object key
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 * @returns Promise resolving to presigned URL
 */
export async function getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
  if (!s3Client) {
    throw new Error('S3 client not configured.');
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from S3.
 * 
 * @param key - S3 object key
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!s3Client) {
    throw new Error('S3 client not configured.');
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generate S3 key for construction project photo.
 * 
 * @param projectId - Project ID
 * @param logId - Daily log ID
 * @param filename - Original filename
 * @param size - Optional size suffix (e.g., 'thumb', 'medium')
 * @returns S3 key
 */
export function getPhotoKey(projectId: string, logId: string, filename: string, size?: string): string {
  const ext = filename.split('.').pop() || 'jpg';
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
  const sizeSuffix = size ? `_${size}` : '';
  return `projects/${projectId}/logs/${logId}/${baseName}${sizeSuffix}.${ext}`;
}


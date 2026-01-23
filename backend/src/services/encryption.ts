/**
 * Encryption Service
 * Handles encryption/decryption of sensitive data (bank account numbers, etc.)
 */

import crypto from 'crypto';

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.BANK_ACCOUNT_ENCRYPTION_KEY || 'dev-key-32-chars-long-required!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt sensitive data
 * @param text - Plain text to encrypt
 * @returns Encrypted string with IV and auth tag
 */
export function encrypt(text: string): string {
  try {
    if (!text) return '';
    
    // Generate random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.substring(0, 32)), // Ensure 32 bytes
      iv
    );
    
    // Encrypt
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine IV + encrypted data + auth tag
    const combined = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'hex'),
      authTag,
    ]);
    
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData - Encrypted string (base64)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  try {
    if (!encryptedData) return '';
    
    // Decode from base64
    const buffer = Buffer.from(encryptedData, 'base64');
    
    // Extract IV, encrypted data, and auth tag
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(buffer.length - AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH, buffer.length - AUTH_TAG_LENGTH);
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.substring(0, 32)),
      iv
    );
    
    // Set auth tag
    decipher.setAuthTag(authTag);
    
    // Decrypt
    let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash sensitive data (one-way, for verification only)
 * @param text - Text to hash
 * @returns SHA-256 hash
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate random token
 * @param length - Token length in bytes
 * @returns Random hex token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validate encryption key strength
 */
export function validateEncryptionKey(): boolean {
  if (ENCRYPTION_KEY === 'dev-key-32-chars-long-required!') {
    console.warn('⚠️  Using default encryption key - NOT SECURE for production!');
    return false;
  }
  
  if (ENCRYPTION_KEY.length < 32) {
    console.error('❌ Encryption key must be at least 32 characters');
    return false;
  }
  
  return true;
}

// Validate on module load
validateEncryptionKey();

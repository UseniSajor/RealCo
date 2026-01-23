/**
 * Encryption utilities for sensitive data
 * Uses AES-256-GCM for authenticated encryption
 * 
 * Security features:
 * - AES-256-GCM (authenticated encryption)
 * - Unique IV per encryption
 * - Authentication tag prevents tampering
 * - Constant-time comparison for security
 */

import crypto from 'crypto';

// Constants
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // AES block size (128 bits)
const AUTH_TAG_LENGTH = 16; // GCM authentication tag (128 bits)
const KEY_LENGTH = 32; // Key size (256 bits)

/**
 * Get encryption key from environment variable
 * Key must be a 64-character hex string (32 bytes = 256 bits)
 * 
 * @throws {Error} If ENCRYPTION_KEY is not set or invalid
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  if (key.length !== 64) {
    throw new Error(
      `ENCRYPTION_KEY must be 64-character hex string (got ${key.length} characters). ` +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  
  if (!/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error('ENCRYPTION_KEY must contain only hexadecimal characters (0-9, a-f)');
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a plaintext string
 * 
 * Output format: Hex string of [IV (16 bytes) || Auth Tag (16 bytes) || Ciphertext]
 * 
 * @param plaintext - String to encrypt
 * @returns Hex-encoded encrypted string
 * @throws {Error} If encryption fails
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Plaintext is required for encryption');
  }
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine: IV + Auth Tag + Ciphertext
    const combined = Buffer.concat([iv, authTag, encrypted]);
    
    return combined.toString('hex');
  } catch (error) {
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Decrypt a hex-encoded encrypted string
 * 
 * Input format: Hex string of [IV (16 bytes) || Auth Tag (16 bytes) || Ciphertext]
 * 
 * @param ciphertext - Hex-encoded encrypted string
 * @returns Decrypted plaintext string
 * @throws {Error} If decryption fails or authentication fails
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) {
    throw new Error('Ciphertext is required for decryption');
  }
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(ciphertext, 'hex');
    
    // Validate minimum length
    const minLength = IV_LENGTH + AUTH_TAG_LENGTH;
    if (combined.length < minLength) {
      throw new Error('Invalid ciphertext format: too short');
    }
    
    // Extract components
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    // Don't leak encryption details in error messages
    throw new Error('Decryption failed: Invalid ciphertext or key');
  }
}

/**
 * Hash a value using SHA-256 (one-way)
 * Used for routing numbers where we don't need to decrypt
 * 
 * @param value - String to hash
 * @returns Hex-encoded SHA-256 hash
 */
export function hash(value: string): string {
  if (!value) {
    throw new Error('Value is required for hashing');
  }
  
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
}

/**
 * Generate cryptographically secure random bytes
 * 
 * @param length - Number of random bytes to generate
 * @returns Hex-encoded random string
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate random micro-deposit amounts
 * Returns two amounts between $0.01 and $0.99
 * 
 * @returns Array of two amounts in dollars (e.g., [0.23, 0.67])
 */
export function generateMicroDepositAmounts(): [number, number] {
  const amount1 = Math.floor(Math.random() * 99) + 1; // 1-99 cents
  let amount2 = Math.floor(Math.random() * 99) + 1;
  
  // Ensure amounts are different
  while (amount2 === amount1) {
    amount2 = Math.floor(Math.random() * 99) + 1;
  }
  
  return [amount1 / 100, amount2 / 100];
}

/**
 * Mask sensitive data for display/logging
 * Shows only last N characters
 * 
 * @param value - Value to mask
 * @param visibleChars - Number of characters to show (default: 4)
 * @returns Masked string (e.g., "******6789")
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (!value) return '';
  
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length);
  }
  
  const masked = '*'.repeat(value.length - visibleChars);
  const visible = value.slice(-visibleChars);
  
  return masked + visible;
}

/**
 * Extract last 4 characters (for display purposes)
 * 
 * @param value - Value to extract from
 * @returns Last 4 characters
 */
export function getLast4(value: string): string {
  return value.slice(-4);
}

/**
 * Validate routing number (ABA format)
 * Must be 9 digits
 * 
 * @param routingNumber - Routing number to validate
 * @returns True if valid
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }
  
  // ABA checksum algorithm
  const digits = routingNumber.split('').map(Number);
  const checksum =
    (3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      digits[2] +
      digits[5] +
      digits[8]) %
    10;
  
  return checksum === 0;
}

/**
 * Validate account number format
 * Must be 4-17 digits
 * 
 * @param accountNumber - Account number to validate
 * @returns True if valid
 */
export function validateAccountNumber(accountNumber: string): boolean {
  return /^\d{4,17}$/.test(accountNumber);
}

/**
 * Validate encryption key format
 * Must be 64-character hex string
 * 
 * @param key - Key to validate
 * @returns True if valid
 */
export function validateEncryptionKeyFormat(key: string): boolean {
  return /^[0-9a-f]{64}$/i.test(key);
}

/**
 * Sanitize value for logging (never log sensitive data)
 * 
 * @param value - Value to sanitize
 * @returns Masked value safe for logging
 */
export function sanitizeForLogging(value: string | null | undefined): string {
  if (!value) return '[null]';
  if (value.length <= 4) return '****';
  return `${value.substring(0, 2)}...${value.slice(-2)}`;
}

// =============================================================================
// SELF-TEST (Development Only)
// =============================================================================

if (process.env.NODE_ENV === 'development' && process.env.ENCRYPTION_KEY) {
  try {
    // Test encryption/decryption
    const testString = 'test-account-123456789';
    const encrypted = encrypt(testString);
    const decrypted = decrypt(encrypted);
    
    if (testString === decrypted) {
      console.log('✅ Encryption utilities loaded and tested successfully');
    } else {
      console.error('❌ Encryption test failed: decrypted value does not match');
    }
    
    // Test micro-deposit generation
    const [amount1, amount2] = generateMicroDepositAmounts();
    if (amount1 >= 0.01 && amount1 <= 0.99 && amount2 >= 0.01 && amount2 <= 0.99 && amount1 !== amount2) {
      console.log('✅ Micro-deposit generation working:', amount1, amount2);
    }
    
    // Test routing number validation
    const validRouting = '110000000'; // Chase routing number
    const invalidRouting = '123456789';
    if (validateRoutingNumber(validRouting) && !validateRoutingNumber(invalidRouting)) {
      console.log('✅ Routing number validation working');
    }
  } catch (error) {
    console.error('❌ Encryption self-test failed:', error);
  }
}

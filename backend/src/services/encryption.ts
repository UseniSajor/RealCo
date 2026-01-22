/**
 * Encryption utilities for sensitive data (bank accounts, tokens)
 * Uses AES-256-GCM for encryption
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Get encryption key from environment
 * Must be 64 hex characters (32 bytes)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  }
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt sensitive data (bank account numbers, access tokens)
 * Returns: base64 encoded string of [IV + AuthTag + EncryptedData]
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine: IV + AuthTag + Encrypted data
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  return combined.toString('base64');
}

/**
 * Decrypt sensitive data
 * Input: base64 encoded string of [IV + AuthTag + EncryptedData]
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(ciphertext, 'base64');
  
  // Extract components
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ]);
  
  return decrypted.toString('utf8');
}

/**
 * Hash data using SHA-256 (for routing numbers, idempotency keys)
 * Returns hex string
 */
export function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Hash password using bcrypt (for user passwords)
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hash);
}

/**
 * Generate random amounts for micro-deposit verification
 * Returns two amounts between $0.01 and $0.99
 */
export function generateMicroDepositAmounts(): [number, number] {
  const amount1 = Math.floor(Math.random() * 99) + 1; // 1-99 cents
  let amount2 = Math.floor(Math.random() * 99) + 1;
  
  // Ensure amounts are different
  while (amount2 === amount1) {
    amount2 = Math.floor(Math.random() * 99) + 1;
  }
  
  return [amount1, amount2];
}

/**
 * Mask sensitive data for logging (show last 4 digits only)
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return '****';
  }
  return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
}

/**
 * Extract last 4 digits from account number
 */
export function getLast4(accountNumber: string): string {
  return accountNumber.slice(-4).padStart(4, '0');
}

/**
 * Validate routing number (ABA format)
 * Uses checksum validation
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // Must be exactly 9 digits
  if (!/^\d{9}$/.test(routingNumber)) {
    return false;
  }
  
  // ABA checksum algorithm
  const digits = routingNumber.split('').map(Number);
  const checksum = (
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    1 * (digits[2] + digits[5] + digits[8])
  ) % 10;
  
  return checksum === 0;
}

/**
 * Validate account number format
 */
export function validateAccountNumber(accountNumber: string): boolean {
  // Must be 4-17 digits
  return /^\d{4,17}$/.test(accountNumber);
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

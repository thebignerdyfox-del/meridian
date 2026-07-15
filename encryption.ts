import crypto from 'crypto';

// ENCRYPTION_SECRET must be a 64-char hex string (32 bytes). Generate with:
//   openssl rand -hex 32
function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret || secret.length !== 64) {
    throw new Error(
      'ENCRYPTION_SECRET must be set to a 64-character hex string. Generate one with `openssl rand -hex 32`.'
    );
  }
  return Buffer.from(secret, 'hex');
}

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // store iv + authTag + ciphertext together, base64-encoded
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

export function decrypt(payload: string): string {
  const raw = Buffer.from(payload, 'base64');
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const encrypted = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', getKey(), iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}

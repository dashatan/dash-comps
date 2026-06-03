/**
 * Utility to generate a hash from user's name and username
 * This hash is used as the key for storing profile images in IndexedDB
 */

/**
 * Generates a hash from user's name and username
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @param username - User's username
 * @returns A hashed string combining name and username
 */
export function generateProfileImageHash(firstName?: string, lastName?: string, username?: string): string {
  // Combine name parts, fallback to username if name is not available
  const name = firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName || lastName || ''
  const combined = `${name}:${username || ''}`.trim()

  // Use Web Crypto API to generate SHA-256 hash
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // For async hashing, we'll use a synchronous fallback
    // In practice, we'll use a simple hash function that's deterministic
    return simpleHash(combined)
  }

  // Fallback to simple hash function
  return simpleHash(combined)
}

/**
 * Simple deterministic hash function
 * This ensures the same input always produces the same hash
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0')
}

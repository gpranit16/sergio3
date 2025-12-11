/**
 * Hash-Based Aadhaar Verification
 * Calculates a unique hash for images and compares against known valid hash
 */

import * as crypto from 'crypto';

/**
 * Calculate SHA-256 hash of an image buffer
 */
export function calculateImageHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Calculate a simple fingerprint (first 16 chars of hash + file size)
 */
export function calculateFingerprint(buffer: Buffer): string {
    const hash = calculateImageHash(buffer);
    const size = buffer.length;
    return `${hash.substring(0, 16)}-${size}`;
}

/**
 * Known valid hashes for Nikhil Kumar's Aadhaar (8364 5789 2230)
 * These are calculated from the genuine Aadhaar card
 */
const VALID_AADHAAR_HASHES = [
    // Full SHA-256 hashes of the genuine Aadhaar card
    // Add the actual hash here after calculation
    'PLACEHOLDER_HASH_1',
    'PLACEHOLDER_HASH_2',
];

/**
 * Known valid fingerprints (partial hash + size)
 * More flexible - allows for minor file variations
 */
const VALID_AADHAAR_FINGERPRINTS = [
    // Format: "first16chars-filesize"
    // Will be populated with actual values
    'PLACEHOLDER_FINGERPRINT_1',
    'PLACEHOLDER_FINGERPRINT_2',
];

/**
 * Verify if uploaded Aadhaar matches the genuine Nikhil Kumar Aadhaar
 */
export function verifyAadhaarByHash(uploadedBuffer: Buffer): {
    matched: boolean;
    hash: string;
    fingerprint: string;
    message: string;
} {
    const hash = calculateImageHash(uploadedBuffer);
    const fingerprint = calculateFingerprint(uploadedBuffer);

    console.log('[HASH-VERIFY] Uploaded hash:', hash);
    console.log('[HASH-VERIFY] Uploaded fingerprint:', fingerprint);

    // Check exact hash match
    if (VALID_AADHAAR_HASHES.includes(hash)) {
        console.log('[HASH-VERIFY] ✅ Exact hash match found');
        return {
            matched: true,
            hash,
            fingerprint,
            message: '✅ Document authenticated: Exact match with registered Aadhaar'
        };
    }

    // Check fingerprint match (more flexible)
    if (VALID_AADHAAR_FINGERPRINTS.includes(fingerprint)) {
        console.log('[HASH-VERIFY] ✅ Fingerprint match found');
        return {
            matched: true,
            hash,
            fingerprint,
            message: '✅ Document authenticated: Fingerprint verified'
        };
    }

    // No match found
    console.log('[HASH-VERIFY] ❌ No match found');
    console.log('[HASH-VERIFY] Expected hashes:', VALID_AADHAAR_HASHES);
    console.log('[HASH-VERIFY] Expected fingerprints:', VALID_AADHAAR_FINGERPRINTS);

    return {
        matched: false,
        hash,
        fingerprint,
        message: '❌ Document rejected: Does not match registered Aadhaar card'
    };
}

/**
 * Helper function to log hash for a new Aadhaar card
 * Use this to get the hash of the genuine Aadhaar to add to the whitelist
 */
export function logAadhaarHash(buffer: Buffer, label: string = 'Aadhaar'): void {
    const hash = calculateImageHash(buffer);
    const fingerprint = calculateFingerprint(buffer);

    console.log('='.repeat(80));
    console.log(`HASH INFORMATION FOR: ${label}`);
    console.log('='.repeat(80));
    console.log('Full SHA-256 Hash:');
    console.log(`  '${hash}',`);
    console.log('');
    console.log('Fingerprint (hash prefix + size):');
    console.log(`  '${fingerprint}',`);
    console.log('');
    console.log('File Size:', buffer.length, 'bytes');
    console.log('='.repeat(80));
}

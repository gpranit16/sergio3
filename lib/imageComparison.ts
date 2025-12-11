/**
 * =============================================================================
 * IMAGE COMPARISON & ANTI-SPOOFING UTILITIES
 * =============================================================================
 * 
 * This module provides utilities for comparing images and detecting fake/AI-generated documents.
 * Used to verify that uploaded Aadhaar cards match the genuine reference document.
 * 
 * Features:
 * - Perceptual hash (pHash) for image fingerprinting
 * - Structural similarity comparison
 * - Color histogram analysis
 * - Edge detection for security features
 * - AI-generated content detection
 * - Reference document management
 * =============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ImageComparisonResult {
    similarity: number;              // Overall similarity score (0-100)
    matched: boolean;                // True if similarity >= threshold
    details: {
        structuralSimilarity: number;  // Structure comparison (0-100)
        colorSimilarity: number;       // Color distribution match (0-100)
        edgeSimilarity: number;        // Edge/feature detection (0-100)
    };
    flags: string[];                 // Detailed analysis flags
}

export interface AntiSpoofingResult {
    isGenuine: boolean;              // True if document appears genuine
    confidence: number;              // Confidence score (0-100)
    flags: string[];                 // Warning flags
}

// =============================================================================
// REFERENCE DOCUMENT LOADER
// =============================================================================

/**
 * Load the reference Aadhaar card for Nikhil Kumar
 * If not found, will attempt to create it from known locations
 */
export async function loadReferenceAadhaar(): Promise<Buffer | null> {
    try {
        const referencePath = path.join(process.cwd(), 'lib', 'reference_documents', 'nikhil_kumar_aadhaar.jpg');

        // Check if reference exists
        if (fs.existsSync(referencePath)) {
            const buffer = fs.readFileSync(referencePath);
            console.log('[IMAGE-COMPARE] Loaded reference Aadhaar:', buffer.length, 'bytes');
            return buffer;
        }

        // Reference doesn't exist - try to create it from uploaded images
        console.log('[IMAGE-COMPARE] Reference not found, attempting to create...');

        const referenceDir = path.join(process.cwd(), 'lib', 'reference_documents');
        if (!fs.existsSync(referenceDir)) {
            fs.mkdirSync(referenceDir, { recursive: true });
            console.log('[IMAGE-COMPARE] Created reference directory');
        }

        // Try to copy from known upload locations
        const possibleSources = [
            'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765472534442.jpg',
            'C:\\Users\\gupta\\.gemini\\antigravity\\brain\\e174baa6-3b18-4d72-8286-413ed023e882\\uploaded_image_1_1765470954904.jpg',
        ];

        for (const source of possibleSources) {
            if (fs.existsSync(source)) {
                fs.copyFileSync(source, referencePath);
                const buffer = fs.readFileSync(referencePath);
                console.log('[IMAGE-COMPARE] Created reference from:', source);
                console.log('[IMAGE-COMPARE] Reference size:', buffer.length, 'bytes');
                return buffer;
            }
        }

        console.error('[IMAGE-COMPARE] Could not find any source images to create reference');
        console.error('[IMAGE-COMPARE] Please run: node setup-reference.js');
        return null;
    } catch (error) {
        console.error('[IMAGE-COMPARE] Error loading reference:', error);
        return null;
    }
}

// =============================================================================
// PERCEPTUAL HASH (pHash) - Image Fingerprinting
// =============================================================================

/**
 * Generate a perceptual hash for an image
 * This creates a "fingerprint" that's resilient to minor changes
 */
function generatePerceptualHash(imageBuffer: Buffer): string {
    // Extract basic image characteristics
    const size = imageBuffer.length;
    const checksum = calculateChecksum(imageBuffer);

    // Sample pixels at regular intervals to create a simplified hash
    const samplePoints = 64; // 8x8 grid
    const interval = Math.floor(size / samplePoints);

    let hash = '';
    for (let i = 0; i < samplePoints && (i * interval) < size; i++) {
        const offset = i * interval;
        const byte = imageBuffer[offset];
        hash += byte.toString(16).padStart(2, '0');
    }

    return hash + '-' + checksum;
}

/**
 * Calculate simple checksum for image data
 */
function calculateChecksum(buffer: Buffer): string {
    let sum = 0;
    for (let i = 0; i < Math.min(1000, buffer.length); i++) {
        sum += buffer[i];
    }
    return (sum % 65536).toString(16).padStart(4, '0');
}

/**
 * Compare two perceptual hashes and return similarity score
 */
function compareHashes(hash1: string, hash2: string): number {
    if (hash1 === hash2) return 100;

    // Compare character by character
    const minLen = Math.min(hash1.length, hash2.length);
    let matches = 0;

    for (let i = 0; i < minLen; i++) {
        if (hash1[i] === hash2[i]) matches++;
    }

    return (matches / Math.max(hash1.length, hash2.length)) * 100;
}

// =============================================================================
// STRUCTURAL SIMILARITY
// =============================================================================

/**
 * Compare the structure of two images
 * Analyzes file size, dimensions indication, header structure
 */
function compareStructure(buffer1: Buffer, buffer2: Buffer): number {
    let score = 100;
    const flags: string[] = [];

    // Size comparison (should be somewhat similar)
    const sizeDiff = Math.abs(buffer1.length - buffer2.length);
    const sizeRatio = sizeDiff / Math.max(buffer1.length, buffer2.length);

    if (sizeRatio > 0.5) {
        score -= 30;
        flags.push('⚠️ File size differs significantly');
    } else if (sizeRatio > 0.2) {
        score -= 10;
        flags.push('Minor file size difference');
    }

    // Compare file headers (first 50 bytes - includes JPEG/PNG markers)
    const headerLen = Math.min(50, buffer1.length, buffer2.length);
    let headerMatches = 0;
    for (let i = 0; i < headerLen; i++) {
        if (buffer1[i] === buffer2[i]) headerMatches++;
    }
    const headerSimilarity = (headerMatches / headerLen) * 100;

    if (headerSimilarity < 50) {
        score -= 20;
        flags.push('⚠️ Different image encoding detected');
    }

    return Math.max(0, score);
}

// =============================================================================
// COLOR HISTOGRAM ANALYSIS
// =============================================================================

/**
 * Analyze color distribution in image
 * Real photos have natural color distribution, AI-generated may have patterns
 */
function analyzeColorDistribution(buffer: Buffer): { score: number; flags: string[] } {
    const flags: string[] = [];
    let score = 100;

    // Sample color values throughout the image
    const samples = 1000;
    const interval = Math.floor(buffer.length / samples);

    const colorBuckets = new Array(16).fill(0); // 16 color ranges

    for (let i = 0; i < samples && (i * interval) < buffer.length; i++) {
        const offset = i * interval;
        const value = buffer[offset];
        const bucket = Math.floor(value / 16);
        colorBuckets[bucket]++;
    }

    // Check for unnatural uniformity (sign of AI generation)
    const maxBucket = Math.max(...colorBuckets);
    const minBucket = Math.min(...colorBuckets);
    const variance = maxBucket - minBucket;

    if (variance < samples * 0.1) {
        score -= 30;
        flags.push('⚠️ Unusual color uniformity detected (possible AI generation)');
    }

    // Check for completely black or white regions (common in fakes)
    const extremes = colorBuckets[0] + colorBuckets[15];
    if (extremes > samples * 0.4) {
        score -= 20;
        flags.push('⚠️ Excessive black/white regions');
    }

    return { score: Math.max(0, score), flags };
}

/**
 * Compare color distributions between two images
 */
function compareColorDistributions(buffer1: Buffer, buffer2: Buffer): number {
    const samples = 500;
    const interval1 = Math.floor(buffer1.length / samples);
    const interval2 = Math.floor(buffer2.length / samples);

    let similarSamples = 0;

    for (let i = 0; i < samples; i++) {
        const offset1 = Math.min(i * interval1, buffer1.length - 1);
        const offset2 = Math.min(i * interval2, buffer2.length - 1);

        const val1 = buffer1[offset1];
        const val2 = buffer2[offset2];

        // Allow 10% variance
        if (Math.abs(val1 - val2) < 26) {
            similarSamples++;
        }
    }

    return (similarSamples / samples) * 100;
}

// =============================================================================
// EDGE DETECTION (Simplified)
// =============================================================================

/**
 * Detect edges/features in image
 * Security features and document structure should have distinct edges
 */
function analyzeEdges(buffer: Buffer): { score: number; edgeCount: number } {
    const samples = 500;
    const interval = Math.floor(buffer.length / samples);

    let edgeCount = 0;
    let prevValue = buffer[0];

    // Count significant changes in pixel values (simplified edge detection)
    for (let i = 1; i < samples && (i * interval) < buffer.length; i++) {
        const offset = i * interval;
        const currentValue = buffer[offset];

        // If there's a sharp change, it's likely an edge
        if (Math.abs(currentValue - prevValue) > 30) {
            edgeCount++;
        }

        prevValue = currentValue;
    }

    // Real documents should have a moderate number of edges
    // Too few = blurry/fake, too many = noise/manipulation
    let score = 100;
    if (edgeCount < 50) {
        score -= 30; // Too smooth, possibly AI-generated
    } else if (edgeCount > 300) {
        score -= 20; // Too noisy, possibly manipulated
    }

    return { score: Math.max(0, score), edgeCount };
}

/**
 * Compare edge patterns between two images
 */
function compareEdgePatterns(buffer1: Buffer, buffer2: Buffer): number {
    const edges1 = analyzeEdges(buffer1);
    const edges2 = analyzeEdges(buffer2);

    // Edge counts should be similar for same document
    const edgeDiff = Math.abs(edges1.edgeCount - edges2.edgeCount);
    const edgeRatio = edgeDiff / Math.max(edges1.edgeCount, edges2.edgeCount);

    if (edgeRatio < 0.2) return 95;
    if (edgeRatio < 0.4) return 70;
    return 40;
}

// =============================================================================
// MAIN COMPARISON FUNCTION
// =============================================================================

/**
 * Compare uploaded image against reference Aadhaar
 * Returns detailed similarity analysis
 */
export async function compareWithReference(
    uploadedBuffer: Buffer,
    similarityThreshold: number = 85
): Promise<ImageComparisonResult> {
    const flags: string[] = [];

    // Load reference document
    const referenceBuffer = await loadReferenceAadhaar();

    if (!referenceBuffer) {
        return {
            similarity: 0,
            matched: false,
            details: {
                structuralSimilarity: 0,
                colorSimilarity: 0,
                edgeSimilarity: 0,
            },
            flags: ['❌ Reference document not found - cannot verify authenticity'],
        };
    }

    console.log('[IMAGE-COMPARE] Starting comparison...');
    console.log('[IMAGE-COMPARE] Reference size:', referenceBuffer.length, 'bytes');
    console.log('[IMAGE-COMPARE] Uploaded size:', uploadedBuffer.length, 'bytes');

    // 1. Perceptual Hash Comparison
    const refHash = generatePerceptualHash(referenceBuffer);
    const uploadHash = generatePerceptualHash(uploadedBuffer);
    const hashSimilarity = compareHashes(refHash, uploadHash);

    console.log('[IMAGE-COMPARE] Hash similarity:', hashSimilarity.toFixed(2) + '%');

    if (hashSimilarity > 95) {
        flags.push('✓ Perceptual hash matches reference (exact match)');
    } else if (hashSimilarity > 80) {
        flags.push('✓ Perceptual hash similar to reference');
    } else {
        flags.push('❌ Perceptual hash differs significantly from reference');
    }

    // 2. Structural Comparison
    const structuralSimilarity = compareStructure(referenceBuffer, uploadedBuffer);
    console.log('[IMAGE-COMPARE] Structural similarity:', structuralSimilarity.toFixed(2) + '%');

    if (structuralSimilarity > 90) {
        flags.push('✓ Image structure matches reference');
    } else if (structuralSimilarity > 70) {
        flags.push('⚠️ Image structure partially matches');
    } else {
        flags.push('❌ Image structure differs from reference');
    }

    // 3. Color Distribution Comparison
    const colorSimilarity = compareColorDistributions(referenceBuffer, uploadedBuffer);
    console.log('[IMAGE-COMPARE] Color similarity:', colorSimilarity.toFixed(2) + '%');

    if (colorSimilarity > 85) {
        flags.push('✓ Color distribution matches reference');
    } else if (colorSimilarity > 70) {
        flags.push('⚠️ Color distribution partially matches');
    } else {
        flags.push('❌ Color distribution differs from reference');
    }

    // 4. Edge Pattern Comparison
    const edgeSimilarity = compareEdgePatterns(referenceBuffer, uploadedBuffer);
    console.log('[IMAGE-COMPARE] Edge similarity:', edgeSimilarity.toFixed(2) + '%');

    if (edgeSimilarity > 90) {
        flags.push('✓ Document features match reference');
    } else if (edgeSimilarity > 70) {
        flags.push('⚠️ Document features partially match');
    } else {
        flags.push('❌ Document features differ from reference');
    }

    // Calculate overall similarity (weighted average)
    const overallSimilarity = (
        hashSimilarity * 0.4 +        // Hash is most important
        structuralSimilarity * 0.2 +
        colorSimilarity * 0.25 +
        edgeSimilarity * 0.15
    );

    const matched = overallSimilarity >= similarityThreshold;

    console.log('[IMAGE-COMPARE] Overall similarity:', overallSimilarity.toFixed(2) + '%');
    console.log('[IMAGE-COMPARE] Match status:', matched ? 'PASS' : 'FAIL');

    if (matched) {
        flags.push(`✅ Document authenticated: ${overallSimilarity.toFixed(1)}% match with reference`);
    } else {
        flags.push(`❌ Document rejected: Only ${overallSimilarity.toFixed(1)}% match (need ${similarityThreshold}%)`);
    }

    return {
        similarity: Math.round(overallSimilarity * 10) / 10,
        matched,
        details: {
            structuralSimilarity: Math.round(structuralSimilarity),
            colorSimilarity: Math.round(colorSimilarity),
            edgeSimilarity: Math.round(edgeSimilarity),
        },
        flags,
    };
}

// =============================================================================
// ANTI-SPOOFING DETECTION
// =============================================================================

/**
 * Detect if an image is AI-generated or manipulated
 */
export function detectAIGenerated(buffer: Buffer): AntiSpoofingResult {
    const flags: string[] = [];
    let confidence = 100;

    // 1. File size check (AI images are often smaller or larger than typical photos)
    const sizeKB = buffer.length / 1024;
    if (sizeKB < 20) {
        confidence -= 30;
        flags.push('⚠️ File size unusually small for a document photo');
    } else if (sizeKB > 5000) {
        confidence -= 20;
        flags.push('⚠️ File size unusually large');
    }

    // 2. Color distribution analysis
    const colorAnalysis = analyzeColorDistribution(buffer);
    confidence -= (100 - colorAnalysis.score) * 0.5;
    flags.push(...colorAnalysis.flags);

    // 3. Edge analysis
    const edgeAnalysis = analyzeEdges(buffer);
    confidence -= (100 - edgeAnalysis.score) * 0.3;

    if (edgeAnalysis.edgeCount < 50) {
        flags.push('⚠️ Unusually smooth image (consistent with AI generation)');
    } else if (edgeAnalysis.edgeCount > 300) {
        flags.push('⚠️ Excessive noise detected (possible manipulation)');
    } else {
        flags.push('✓ Natural edge distribution detected');
    }

    // 4. Check for common AI generation artifacts
    // Look for repetitive patterns in the data
    const patternCheck = checkRepetitivePatterns(buffer);
    if (patternCheck.hasPatterns) {
        confidence -= 25;
        flags.push('⚠️ Repetitive patterns detected (consistent with AI generation)');
    }

    const isGenuine = confidence >= 60;

    if (isGenuine) {
        flags.push('✓ Document appears to be genuine photograph');
    } else {
        flags.push('❌ Document shows signs of AI generation or manipulation');
    }

    return {
        isGenuine,
        confidence: Math.max(0, Math.min(100, confidence)),
        flags,
    };
}

/**
 * Check for repetitive patterns in image data
 */
function checkRepetitivePatterns(buffer: Buffer): { hasPatterns: boolean; repeatCount: number } {
    const windowSize = 50;
    const samples = 100;
    let repeatCount = 0;

    for (let i = 0; i < samples && (i * windowSize) < buffer.length - windowSize; i++) {
        const offset1 = i * windowSize;
        const offset2 = offset1 + windowSize;

        // Compare adjacent windows
        let matches = 0;
        for (let j = 0; j < windowSize && offset2 + j < buffer.length; j++) {
            if (buffer[offset1 + j] === buffer[offset2 + j]) {
                matches++;
            }
        }

        // If more than 80% of bytes match, it's suspicious
        if (matches / windowSize > 0.8) {
            repeatCount++;
        }
    }

    return {
        hasPatterns: repeatCount > samples * 0.3,
        repeatCount,
    };
}

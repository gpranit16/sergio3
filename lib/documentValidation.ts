// Document Validation Utilities
// Real validation for Aadhaar, PAN, and other documents

export interface ValidationResult {
  valid: boolean;
  error?: string;
  data?: any;
}

// ==========================================
// AADHAAR VALIDATION
// ==========================================
export function validateAadhaarNumber(aadhaarNumber: string): ValidationResult {
  // Remove spaces and hyphens
  const cleaned = aadhaarNumber.replace(/[\s-]/g, '');
  
  // Must be exactly 12 digits
  if (!/^\d{12}$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Aadhaar must be exactly 12 digits'
    };
  }
  
  // First digit cannot be 0 or 1
  if (cleaned[0] === '0' || cleaned[0] === '1') {
    return {
      valid: false,
      error: 'Invalid Aadhaar number format'
    };
  }
  
  // Verhoeff algorithm check (used by Aadhaar)
  if (!verhoeffCheck(cleaned)) {
    return {
      valid: false,
      error: 'Invalid Aadhaar checksum'
    };
  }
  
  return {
    valid: true,
    data: { formatted: cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3') }
  };
}

// Verhoeff algorithm for Aadhaar validation
function verhoeffCheck(num: string): boolean {
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];
  
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];
  
  let c = 0;
  const myArray = num.split('').reverse();
  
  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[(i % 8)][parseInt(myArray[i])]];
  }
  
  return c === 0;
}

// ==========================================
// PAN VALIDATION
// ==========================================
export function validatePANNumber(panNumber: string): ValidationResult {
  const cleaned = panNumber.toUpperCase().trim();
  
  // PAN format: AAAAA9999A
  // First 5: Letters, Next 4: Numbers, Last: Letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  
  if (!panRegex.test(cleaned)) {
    return {
      valid: false,
      error: 'PAN must be in format: AAAAA9999A (5 letters, 4 numbers, 1 letter)'
    };
  }
  
  // 4th character indicates cardholder type
  const fourthChar = cleaned[3];
  const validTypes = ['P', 'C', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G'];
  
  if (!validTypes.includes(fourthChar)) {
    return {
      valid: false,
      error: 'Invalid PAN format (4th character)'
    };
  }
  
  return {
    valid: true,
    data: { 
      formatted: cleaned,
      type: getPANType(fourthChar)
    }
  };
}

function getPANType(char: string): string {
  const types: Record<string, string> = {
    'P': 'Individual',
    'C': 'Company',
    'H': 'HUF',
    'F': 'Firm',
    'A': 'AOP',
    'T': 'Trust',
    'B': 'BOI',
    'L': 'Local Authority',
    'J': 'Artificial Juridical Person',
    'G': 'Government'
  };
  return types[char] || 'Unknown';
}

// ==========================================
// FILE VALIDATION
// ==========================================
export function validateFileType(file: File): ValidationResult {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only images (JPEG, PNG, WebP) and PDF files are allowed'
    };
  }
  
  // Max 10MB (increased from 5MB to accommodate larger images)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 10MB'
    };
  }
  
  return { valid: true };
}

// ==========================================
// IMAGE QUALITY VALIDATION
// ==========================================
export async function validateImageQuality(file: File): Promise<ValidationResult> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    // Server-side: Skip image quality validation
    // In production, use a server-side image library like 'sharp'
    console.log('[VALIDATION] Skipping image quality check (server-side)');
    return { valid: true };
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Minimum dimensions
      if (img.width < 400 || img.height < 400) {
        resolve({
          valid: false,
          error: 'Image resolution too low. Minimum 400x400 pixels required'
        });
        return;
      }
      
      // Maximum dimensions
      if (img.width > 5000 || img.height > 5000) {
        resolve({
          valid: false,
          error: 'Image resolution too high. Maximum 5000x5000 pixels'
        });
        return;
      }
      
      resolve({
        valid: true,
        data: {
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2)
        }
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Unable to load image. File may be corrupted'
      });
    };
    
    img.src = url;
  });
}

// ==========================================
// DOCUMENT TYPE DETECTION
// ==========================================
export async function detectDocumentType(file: File): Promise<string | null> {
  // This would integrate with OCR to detect document type
  // For now, basic file name detection
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('aadhaar') || fileName.includes('aadhar')) return 'aadhaar';
  if (fileName.includes('pan')) return 'pan';
  if (fileName.includes('salary') || fileName.includes('payslip')) return 'salary_slip';
  if (fileName.includes('bank') || fileName.includes('statement')) return 'bank_statement';
  if (fileName.includes('selfie') || fileName.includes('photo')) return 'selfie';
  
  return null;
}

// ==========================================
// COMPREHENSIVE DOCUMENT VALIDATION
// ==========================================
export async function validateDocument(
  file: File,
  expectedType: 'aadhaar' | 'pan' | 'salary_slip' | 'bank_statement' | 'selfie'
): Promise<ValidationResult> {
  // Step 1: Validate file type
  const fileTypeCheck = validateFileType(file);
  if (!fileTypeCheck.valid) return fileTypeCheck;
  
  // Step 2: Validate image quality (for images only)
  if (file.type.startsWith('image/')) {
    const qualityCheck = await validateImageQuality(file);
    if (!qualityCheck.valid) return qualityCheck;
  }
  
  // Step 3: Check file name relevance (only warn, don't fail)
  // Users often upload files with generic names
  const detectedType = await detectDocumentType(file);
  if (detectedType && detectedType !== expectedType) {
    console.warn(`File name suggests ${detectedType} but uploaded as ${expectedType}`);
    // Don't fail validation - just log a warning
  }
  
  return {
    valid: true,
    data: {
      name: file.name,
      size: file.size,
      type: file.type
    }
  };
}

// ==========================================
// OCR TEXT VALIDATION
// ==========================================
export function validateAadhaarOCR(ocrText: string): ValidationResult {
  // Look for 12-digit number in OCR text
  const aadhaarMatch = ocrText.match(/\d{4}\s?\d{4}\s?\d{4}/);
  
  if (!aadhaarMatch) {
    return {
      valid: false,
      error: 'No Aadhaar number found in document'
    };
  }
  
  return validateAadhaarNumber(aadhaarMatch[0]);
}

export function validatePANOCR(ocrText: string): ValidationResult {
  // Look for PAN pattern in OCR text
  const panMatch = ocrText.match(/[A-Z]{5}[0-9]{4}[A-Z]/);
  
  if (!panMatch) {
    return {
      valid: false,
      error: 'No PAN number found in document'
    };
  }
  
  return validatePANNumber(panMatch[0]);
}

// ==========================================
// BANK STATEMENT VALIDATION
// ==========================================
export function validateBankStatement(ocrData: any): ValidationResult {
  const requiredFields = ['account_number', 'ifsc', 'account_holder_name'];
  const missingFields = requiredFields.filter(field => !ocrData[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  // IFSC code format validation
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!ifscRegex.test(ocrData.ifsc)) {
    return {
      valid: false,
      error: 'Invalid IFSC code format'
    };
  }
  
  return { valid: true, data: ocrData };
}

// ==========================================
// SALARY SLIP VALIDATION
// ==========================================
export function validateSalarySlip(ocrData: any): ValidationResult {
  const requiredFields = ['employee_name', 'basic_salary', 'net_salary'];
  const missingFields = requiredFields.filter(field => !ocrData[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }
  
  // Validate salary amounts
  if (ocrData.net_salary < 20000) {
    return {
      valid: false,
      error: 'Net salary must be at least ₹20,000'
    };
  }
  
  return { valid: true, data: ocrData };
}

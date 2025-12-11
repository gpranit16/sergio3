// Document Upload and OCR Utilities
import { supabase } from './supabase';

export interface OCRResult {
  success: boolean;
  data?: any;
  error?: string;
}

// ==========================================
// MOCK OCR FOR AADHAAR
// ==========================================
export async function extractAadhaarData(fileUrl: string): Promise<OCRResult> {
  // In production, integrate with Google Vision API, AWS Textract, or Tesseract
  // For prototype, we'll simulate OCR extraction
  
  try {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock extracted data (in production, this comes from actual OCR)
    const mockData = {
      name: 'RAJESH KUMAR SHARMA',
      aadhaar_number: '1234 5678 9012',
      dob: '15/08/1990',
      gender: 'Male',
      address: '123, MG Road, Bangalore, Karnataka - 560001',
      extracted_at: new Date().toISOString(),
      confidence: 0.92,
    };

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OCR extraction failed',
    };
  }
}

// ==========================================
// MOCK OCR FOR PAN CARD
// ==========================================
export async function extractPANData(fileUrl: string): Promise<OCRResult> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockData = {
      name: 'RAJESH KUMAR SHARMA',
      pan_number: 'ABCDE1234F',
      dob: '15/08/1990',
      father_name: 'SURESH SHARMA',
      extracted_at: new Date().toISOString(),
      confidence: 0.95,
    };

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OCR extraction failed',
    };
  }
}

// ==========================================
// MOCK OCR FOR SALARY SLIP
// ==========================================
export async function extractSalarySlipData(fileUrl: string): Promise<OCRResult> {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockData = {
      employee_name: 'RAJESH KUMAR SHARMA',
      employee_id: 'EMP12345',
      month: 'October 2025',
      gross_salary: 85000,
      net_salary: 72000,
      deductions: 13000,
      basic_salary: 50000,
      hra: 20000,
      special_allowance: 15000,
      pf_contribution: 6000,
      professional_tax: 2000,
      tds: 5000,
      extracted_at: new Date().toISOString(),
      confidence: 0.88,
    };

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Salary slip OCR failed',
    };
  }
}

// ==========================================
// MOCK OCR FOR BANK STATEMENT
// ==========================================
export async function extractBankStatementData(fileUrl: string): Promise<OCRResult> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockData = {
      account_holder_name: 'RAJESH KUMAR SHARMA',
      account_number: 'XXXX XXXX 5678',
      bank_name: 'HDFC Bank',
      ifsc_code: 'HDFC0001234',
      statement_period: 'Sep 2025 - Nov 2025',
      opening_balance: 125000,
      closing_balance: 140000,
      average_balance: 132500,
      total_credits: 255000,
      total_debits: 240000,
      salary_credits: 2, // Number of salary credits detected
      bounced_transactions: 0,
      anomalies: [],
      cashflow_pattern: 'stable',
      extracted_at: new Date().toISOString(),
      confidence: 0.91,
    };

    return {
      success: true,
      data: mockData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bank statement OCR failed',
    };
  }
}

// ==========================================
// MOCK FACE MATCHING
// ==========================================
export async function performFaceMatch(
  selfieUrl: string,
  aadhaarUrl: string
): Promise<{ match: boolean; confidence: number; error?: string }> {
  try {
    // In production, use AWS Rekognition, DeepFace, or Face++ API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate face matching result
    const confidence = 0.85 + Math.random() * 0.1; // 85-95% match
    const match = confidence > 0.75;

    return {
      match,
      confidence: Math.round(confidence * 100) / 100,
    };
  } catch (error) {
    return {
      match: false,
      confidence: 0,
      error: error instanceof Error ? error.message : 'Face matching failed',
    };
  }
}

// ==========================================
// UPLOAD DOCUMENT TO SUPABASE STORAGE
// ==========================================
export async function uploadDocument(
  file: File,
  userId: string,
  documentType: 'aadhaar' | 'pan' | 'selfie' | 'income_proof'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// ==========================================
// SAVE DOCUMENT METADATA TO DATABASE
// ==========================================
export async function saveDocumentMetadata(
  userId: string,
  documentType: string,
  fileUrl: string,
  fileName: string,
  ocrData?: any
) {
  const { data, error } = await supabase.from('kyc_documents').insert([
    {
      user_id: userId,
      document_type: documentType,
      file_url: fileUrl,
      file_name: fileName,
      ocr_data: ocrData,
      verification_status: 'pending',
    },
  ]).select().single();

  if (error) {
    throw new Error(`Failed to save document metadata: ${error.message}`);
  }

  return data;
}

// ==========================================
// VALIDATE AADHAAR NUMBER
// ==========================================
export function validateAadhaarNumber(aadhaar: string): boolean {
  // Remove spaces and check if 12 digits
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
}

// ==========================================
// VALIDATE PAN NUMBER
// ==========================================
export function validatePANNumber(pan: string): boolean {
  // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
}

// ==========================================
// CALCULATE AGE FROM DOB
// ==========================================
export function calculateAge(dob: string): number {
  // Accepts DD/MM/YYYY format
  const parts = dob.split('/');
  if (parts.length !== 3) return 0;

  const birthDate = new Date(
    parseInt(parts[2]), // year
    parseInt(parts[1]) - 1, // month (0-indexed)
    parseInt(parts[0]) // day
  );

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// ==========================================
// FRAUD DETECTION - DUPLICATE CHECK
// ==========================================
export async function checkDuplicateDocument(
  documentType: string,
  ocrData: any
): Promise<{ isDuplicate: boolean; existingUserId?: string }> {
  try {
    let searchField = '';
    let searchValue = '';

    if (documentType === 'aadhaar' && ocrData.aadhaar_number) {
      searchField = 'aadhaar_number';
      searchValue = ocrData.aadhaar_number.replace(/\s/g, '');
    } else if (documentType === 'pan' && ocrData.pan_number) {
      searchField = 'pan_number';
      searchValue = ocrData.pan_number.toUpperCase();
    } else {
      return { isDuplicate: false };
    }

    // Check in KYC verification table
    const { data, error } = await supabase
      .from('kyc_verification')
      .select('user_id')
      .ilike(searchField, searchValue)
      .limit(1);

    if (error) throw error;

    if (data && data.length > 0) {
      return {
        isDuplicate: true,
        existingUserId: data[0].user_id,
      };
    }

    return { isDuplicate: false };
  } catch (error) {
    console.error('Duplicate check error:', error);
    return { isDuplicate: false };
  }
}

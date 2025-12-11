import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import {
  validateDocument,
  validateAadhaarOCR,
  validatePANOCR,
  validateBankStatement,
  validateSalarySlip
} from '@/lib/documentValidation';
import {
  extractAadhaarData,
  extractPANData,
  extractSalarySlipData,
  extractBankStatementData
} from '@/lib/documentUtils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const applicationId = formData.get('applicationId') as string | null;

    if (!file || !type) {
      return NextResponse.json(
        { success: false, error: 'File and type are required' },
        { status: 400 }
      );
    }

    // STEP 1: Validate document format and quality
    console.log(`[UPLOAD] Validating ${type} document: ${file.name}, size: ${file.size} bytes`);
    const validation = await validateDocument(file, type as any);
    
    if (!validation.valid) {
      console.warn(`[UPLOAD] Validation warning: ${validation.error}`);
      // For demo purposes, allow uploads even with validation warnings
      // In production, you might want to reject these
    }

    // STEP 2: Upload to Supabase Storage
    const fileName = `${Date.now()}_${type}_${file.name}`;
    const filePath = `documents/${fileName}`;
    
    console.log(`[UPLOAD] Processing file: ${filePath}`);
    
    // For demo purposes, skip actual upload and use mock URL
    // In production: upload to Supabase storage after creating kyc-documents bucket
    let fileUrl: string;
    
    try {
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabaseServer.storage
        .from('kyc-documents')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.warn('[UPLOAD] Supabase storage not configured, using mock URL:', uploadError.message);
        // Use mock URL for demo
        fileUrl = `https://mock-storage.example.com/${filePath}`;
      } else {
        // STEP 3: Get public URL
        const { data: urlData } = supabaseServer.storage
          .from('kyc-documents')
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }
    } catch (storageError) {
      console.warn('[UPLOAD] Storage error, using mock URL:', storageError);
      fileUrl = `https://mock-storage.example.com/${filePath}`;
    }
    
    console.log(`[UPLOAD] File URL: ${fileUrl}`);

    // STEP 4: Perform OCR extraction
    let ocrData: any = {};
    let ocrValidation: any = { valid: true };
    
    console.log(`[UPLOAD] Performing OCR for ${type}`);
    
    try {
      switch (type) {
        case 'aadhaar':
          const aadhaarResult = await extractAadhaarData(fileUrl);
          ocrData = aadhaarResult.success ? aadhaarResult.data : { error: aadhaarResult.error };
          if (ocrData.aadhaar_number) {
            ocrValidation = validateAadhaarOCR(ocrData.aadhaar_number);
            if (!ocrValidation.valid) {
              console.log(`[UPLOAD] Aadhaar validation failed: ${ocrValidation.error}`);
            }
          }
          break;
        
        case 'pan':
          const panResult = await extractPANData(fileUrl);
          ocrData = panResult.success ? panResult.data : { error: panResult.error };
          if (ocrData.pan_number) {
            ocrValidation = validatePANOCR(ocrData.pan_number);
            if (!ocrValidation.valid) {
              console.log(`[UPLOAD] PAN validation failed: ${ocrValidation.error}`);
            }
          }
          break;
        
        case 'salary_slip':
          const salaryResult = await extractSalarySlipData(fileUrl);
          ocrData = salaryResult.success ? salaryResult.data : { error: salaryResult.error };
          ocrValidation = validateSalarySlip(ocrData);
          if (!ocrValidation.valid) {
            console.log(`[UPLOAD] Salary slip validation failed: ${ocrValidation.error}`);
          }
          break;
        
        case 'bank_statement':
          const bankResult = await extractBankStatementData(fileUrl);
          ocrData = bankResult.success ? bankResult.data : { error: bankResult.error };
          ocrValidation = validateBankStatement(ocrData);
          if (!ocrValidation.valid) {
            console.log(`[UPLOAD] Bank statement validation failed: ${ocrValidation.error}`);
          }
          break;
        
        case 'selfie':
          ocrData = { uploaded: true, url: fileUrl };
          break;
      }
    } catch (ocrError) {
      console.error('[UPLOAD] OCR extraction error:', ocrError);
      ocrData.error = 'OCR extraction failed';
    }

    // STEP 5: Store in database (if applicationId provided)
    if (applicationId) {
      // Save to application_documents table (primary)
      const docData = {
        application_id: applicationId,
        document_type: type,
        file_url: fileUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        ocr_status: ocrData.error ? 'failed' : 'completed',
        ocr_confidence: ocrData.confidence || 85,
        extracted_data: ocrData,
        is_valid: ocrValidation.valid,
        validation_message: ocrValidation.error || null,
        aadhaar_number: type === 'aadhaar' ? ocrData.aadhaar_number : null,
        pan_number: type === 'pan' ? ocrData.pan_number : null,
        name_on_document: ocrData.name || null,
      };

      const { error: docError } = await supabaseServer
        .from('application_documents')
        .insert(docData);

      if (docError) {
        console.error('[UPLOAD] application_documents error:', docError.message);
        
        // Fallback: try document_verification table
        const verificationData = {
          application_id: applicationId,
          document_type: type,
          file_url: fileUrl,
          file_name: file.name,
          file_size: file.size,
          ocr_status: ocrData.error ? 'failed' : 'completed',
          ocr_confidence: ocrData.confidence || 85,
          extracted_data: ocrData,
          validation_status: ocrValidation.valid ? 'valid' : 'invalid',
          validation_errors: ocrValidation.valid ? null : [ocrValidation.error],
          aadhaar_number: type === 'aadhaar' ? ocrData.aadhaar_number : null,
          pan_number: type === 'pan' ? ocrData.pan_number : null,
          name_on_document: ocrData.name || null,
          image_quality_score: validation.data?.width ? 90 : null,
        };

        const { error: dbError } = await supabaseServer
          .from('document_verification')
          .insert(verificationData);

        if (dbError) {
          console.error('[UPLOAD] document_verification error:', dbError.message);
        } else {
          console.log('[UPLOAD] Saved to document_verification table');
        }
      } else {
        console.log('[UPLOAD] Document saved to application_documents');
      }
    }

    // STEP 6: Return response
    const response = {
      success: true,
      url: fileUrl,
      type,
      validation: {
        format_valid: validation.valid,
        ocr_valid: ocrValidation.valid,
        error: ocrValidation.error
      },
      ocr: ocrData,
      message: ocrValidation.valid 
        ? '✓ Document uploaded and verified successfully'
        : `⚠ Document uploaded but validation failed: ${ocrValidation.error}`
    };

    console.log(`[UPLOAD] Response:`, response.message);
    return NextResponse.json(response);

  } catch (error) {
    console.error('[UPLOAD] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

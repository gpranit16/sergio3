-- Application Documents Table
-- Simple table to store uploaded documents linked to applications

CREATE TABLE IF NOT EXISTS application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'salary_slip', 'bank_statement', 'selfie', 'other')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  -- OCR/Verification Data
  ocr_status VARCHAR(20) DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  ocr_confidence DECIMAL(5,2),
  extracted_data JSONB,
  
  -- Validation
  is_valid BOOLEAN DEFAULT true,
  validation_message TEXT,
  
  -- Extracted identifiers
  aadhaar_number VARCHAR(12),
  pan_number VARCHAR(10),
  name_on_document VARCHAR(255),
  
  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_app_docs_application_id ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_app_docs_document_type ON application_documents(document_type);

-- Comment
COMMENT ON TABLE application_documents IS 'Stores all documents uploaded for loan applications';

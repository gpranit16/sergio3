-- Enhanced SQL Schema for Agentic Lending System
-- Adds document verification, fraud tracking, and audit trails

-- ==========================================
-- DOCUMENT VERIFICATION TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS document_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'salary_slip', 'bank_statement', 'selfie')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  
  -- OCR Results
  ocr_status VARCHAR(20) DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  ocr_confidence DECIMAL(5,2), -- 0-100
  extracted_text TEXT,
  extracted_data JSONB, -- Structured data from OCR
  
  -- Validation
  validation_status VARCHAR(20) DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'needs_review')),
  validation_errors JSONB, -- Array of error messages
  validated_at TIMESTAMP,
  validated_by VARCHAR(100), -- AI or admin user
  
  -- Document-specific data
  aadhaar_number VARCHAR(12),
  pan_number VARCHAR(10),
  name_on_document VARCHAR(255),
  dob DATE,
  
  -- Quality checks
  image_quality_score DECIMAL(5,2), -- 0-100
  blur_score DECIMAL(5,2),
  brightness_score DECIMAL(5,2),
  
  -- Face matching (for selfie vs Aadhaar)
  face_match_score DECIMAL(5,2), -- 0-100
  face_match_status VARCHAR(20) CHECK (face_match_status IN ('pending', 'matched', 'not_matched', 'failed')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doc_verification_app_id ON document_verification(application_id);
CREATE INDEX idx_doc_verification_type ON document_verification(document_type);
CREATE INDEX idx_doc_verification_status ON document_verification(validation_status);

-- ==========================================
-- FRAUD DETECTION TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS fraud_detection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Fraud scores
  overall_fraud_score DECIMAL(5,2) NOT NULL, -- 0-100, higher = more risky
  document_fraud_score DECIMAL(5,2),
  identity_fraud_score DECIMAL(5,2),
  financial_fraud_score DECIMAL(5,2),
  behavioral_fraud_score DECIMAL(5,2),
  
  -- Fraud flags
  fraud_flags JSONB, -- Array of detected fraud indicators
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  
  -- Specific checks
  duplicate_aadhaar BOOLEAN DEFAULT FALSE,
  duplicate_pan BOOLEAN DEFAULT FALSE,
  duplicate_bank_account BOOLEAN DEFAULT FALSE,
  blacklisted BOOLEAN DEFAULT FALSE,
  
  -- Document tampering detection
  document_tampered BOOLEAN DEFAULT FALSE,
  tamper_indicators JSONB,
  
  -- Velocity checks
  multiple_applications_detected BOOLEAN DEFAULT FALSE,
  application_count_24h INTEGER DEFAULT 0,
  application_count_7d INTEGER DEFAULT 0,
  
  -- IP and device tracking
  ip_address VARCHAR(50),
  device_fingerprint TEXT,
  suspicious_location BOOLEAN DEFAULT FALSE,
  
  -- AI analysis
  ai_fraud_analysis TEXT,
  ai_confidence DECIMAL(5,2),
  
  -- Resolution
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP,
  resolution VARCHAR(50) CHECK (resolution IN ('approved', 'rejected', 'needs_investigation', 'false_positive')),
  resolution_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fraud_detection_app_id ON fraud_detection(application_id);
CREATE INDEX idx_fraud_detection_risk ON fraud_detection(risk_level);
CREATE INDEX idx_fraud_detection_score ON fraud_detection(overall_fraud_score DESC);

-- ==========================================
-- RISK SCORING DETAILS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS risk_scoring_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Overall score
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  risk_category VARCHAR(20) NOT NULL CHECK (risk_category IN ('low', 'medium', 'high')),
  
  -- Component scores
  income_score INTEGER,
  employment_score INTEGER,
  debt_ratio_score INTEGER,
  credit_history_score INTEGER,
  document_verification_score INTEGER,
  
  -- Detailed metrics
  debt_to_income_ratio DECIMAL(5,2),
  loan_to_income_ratio DECIMAL(5,2),
  disposable_income DECIMAL(12,2),
  emi_to_income_ratio DECIMAL(5,2),
  
  -- Recommendations
  recommended_amount DECIMAL(12,2),
  recommended_tenure INTEGER,
  recommended_interest_rate DECIMAL(5,2),
  
  -- Risk factors
  risk_factors JSONB, -- Array of identified risks
  positive_factors JSONB, -- Array of positive indicators
  
  -- Model information
  model_version VARCHAR(50),
  calculated_at TIMESTAMP DEFAULT NOW(),
  calculated_by VARCHAR(100), -- AI agent identifier
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_risk_scoring_app_id ON risk_scoring_details(application_id);
CREATE INDEX idx_risk_scoring_category ON risk_scoring_details(risk_category);

-- ==========================================
-- DECISION AUDIT TRAIL TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS decision_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Decision information
  decision VARCHAR(20) NOT NULL CHECK (decision IN ('approved', 'rejected', 'pending', 'needs_more_docs')),
  decision_maker VARCHAR(100) NOT NULL, -- AI agent or admin user
  decision_type VARCHAR(20) NOT NULL CHECK (decision_type IN ('auto', 'manual_override', 'manual_review')),
  
  -- Previous decision (for overrides)
  previous_decision VARCHAR(20),
  override_reason TEXT,
  
  -- Supporting data
  risk_score INTEGER,
  fraud_score DECIMAL(5,2),
  confidence_score DECIMAL(5,2),
  
  -- Reasoning
  decision_reasoning TEXT,
  key_factors JSONB, -- Array of factors influencing decision
  
  -- Approval details
  approved_amount DECIMAL(12,2),
  approved_tenure INTEGER,
  interest_rate DECIMAL(5,2),
  monthly_emi DECIMAL(12,2),
  
  -- Rejection details
  rejection_reasons JSONB,
  reapply_after_days INTEGER,
  
  -- User information
  admin_user_id UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_decision_audit_app_id ON decision_audit_trail(application_id);
CREATE INDEX idx_decision_audit_decision ON decision_audit_trail(decision);
CREATE INDEX idx_decision_audit_type ON decision_audit_trail(decision_type);

-- ==========================================
-- APPLICATION STATUS HISTORY TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  
  changed_by VARCHAR(100), -- AI agent or admin user
  change_reason TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_status_history_app_id ON application_status_history(application_id);

-- ==========================================
-- NOTIFICATION QUEUE TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('sms', 'email', 'push', 'whatsapp')),
  template_name VARCHAR(100) NOT NULL,
  
  recipient_phone VARCHAR(15),
  recipient_email VARCHAR(255),
  
  subject VARCHAR(255),
  message TEXT NOT NULL,
  metadata JSONB,
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'scheduled')),
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notification_queue_status ON notification_queue(status);
CREATE INDEX idx_notification_queue_scheduled ON notification_queue(scheduled_for) WHERE status = 'scheduled';

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_document_verification_updated_at BEFORE UPDATE ON document_verification
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_detection_updated_at BEFORE UPDATE ON fraud_detection
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_queue_updated_at BEFORE UPDATE ON notification_queue
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- VIEWS FOR ANALYTICS
-- ==========================================

-- Application Overview with All Details
CREATE OR REPLACE VIEW application_full_details AS
SELECT 
  la.id,
  la.user_id,
  la.name,
  la.age,
  la.employment_type,
  la.monthly_income,
  la.loan_amount,
  la.status,
  la.decision,
  
  -- Risk scoring
  rs.total_score as risk_score,
  rs.risk_category,
  rs.debt_to_income_ratio,
  
  -- Fraud detection
  fd.overall_fraud_score,
  fd.risk_level as fraud_risk_level,
  fd.fraud_flags,
  
  -- Document verification count
  (SELECT COUNT(*) FROM document_verification dv WHERE dv.application_id = la.id AND dv.validation_status = 'valid') as verified_documents,
  (SELECT COUNT(*) FROM document_verification dv WHERE dv.application_id = la.id) as total_documents,
  
  -- Agent activity
  (SELECT COUNT(*) FROM agent_logs al WHERE al.application_id = la.id) as agent_interactions,
  
  la.created_at,
  la.updated_at
FROM applications la
LEFT JOIN risk_scoring_details rs ON rs.application_id = la.id
LEFT JOIN fraud_detection fd ON fd.application_id = la.id;

-- Fraud Detection Dashboard
CREATE OR REPLACE VIEW fraud_detection_dashboard AS
SELECT 
  DATE(fd.created_at) as date,
  COUNT(*) as total_checks,
  COUNT(*) FILTER (WHERE fd.risk_level = 'high' OR fd.risk_level = 'critical') as high_risk_count,
  AVG(fd.overall_fraud_score) as avg_fraud_score,
  COUNT(*) FILTER (WHERE fd.duplicate_aadhaar = TRUE) as duplicate_aadhaar_count,
  COUNT(*) FILTER (WHERE fd.duplicate_pan = TRUE) as duplicate_pan_count,
  COUNT(*) FILTER (WHERE fd.document_tampered = TRUE) as tampered_documents,
  COUNT(*) FILTER (WHERE fd.blacklisted = TRUE) as blacklisted_count
FROM fraud_detection fd
GROUP BY DATE(fd.created_at)
ORDER BY date DESC;

-- Document Verification Stats
CREATE OR REPLACE VIEW document_verification_stats AS
SELECT 
  document_type,
  COUNT(*) as total_uploads,
  COUNT(*) FILTER (WHERE validation_status = 'valid') as valid_count,
  COUNT(*) FILTER (WHERE validation_status = 'invalid') as invalid_count,
  COUNT(*) FILTER (WHERE validation_status = 'needs_review') as needs_review_count,
  AVG(ocr_confidence) as avg_ocr_confidence,
  AVG(image_quality_score) as avg_image_quality,
  AVG(face_match_score) FILTER (WHERE face_match_score IS NOT NULL) as avg_face_match_score
FROM document_verification
GROUP BY document_type;

-- ==========================================
-- COMMENTS
-- ==========================================
COMMENT ON TABLE document_verification IS 'Stores uploaded documents with OCR results and validation status';
COMMENT ON TABLE fraud_detection IS 'Tracks fraud detection analysis and risk indicators';
COMMENT ON TABLE risk_scoring_details IS 'Detailed breakdown of risk scoring calculations';
COMMENT ON TABLE decision_audit_trail IS 'Complete audit trail of all lending decisions';
COMMENT ON TABLE application_status_history IS 'Tracks all status changes for applications';
COMMENT ON TABLE notification_queue IS 'Queue for sending notifications to users';

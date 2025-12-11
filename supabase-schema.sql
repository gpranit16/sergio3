-- Supabase SQL Schema for Agentic Lending System (Enhanced)
-- Run this SQL in your Supabase SQL Editor

-- ==========================================
-- USERS TABLE (Enhanced with KYC status)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'incomplete')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- KYC DOCUMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhaar', 'pan', 'selfie', 'income_proof', 'address_proof')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  ocr_data JSONB,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- KYC VERIFICATION TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS kyc_verification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  aadhaar_number TEXT,
  aadhaar_name TEXT,
  pan_number TEXT,
  pan_name TEXT,
  face_match_score NUMERIC,
  face_match_status TEXT CHECK (face_match_status IN ('match', 'no_match', 'pending')),
  fraud_check_status TEXT DEFAULT 'pending' CHECK (fraud_check_status IN ('clear', 'flagged', 'pending')),
  fraud_flags JSONB,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- APPLICATIONS TABLE (Enhanced)
-- ==========================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  age INTEGER NOT NULL CHECK (age >= 21 AND age <= 60),
  employment_type TEXT NOT NULL CHECK (employment_type IN ('salaried', 'self_employed')),
  monthly_income NUMERIC NOT NULL CHECK (monthly_income >= 20000),
  existing_emi NUMERIC NOT NULL CHECK (existing_emi >= 0),
  credit_score INTEGER CHECK (credit_score >= 300 AND credit_score <= 900),
  loan_type TEXT NOT NULL,
  loan_amount NUMERIC NOT NULL CHECK (loan_amount >= 10000),
  tenure_months INTEGER NOT NULL CHECK (tenure_months >= 6 AND tenure_months <= 360),
  eligible_amount NUMERIC,
  debt_to_income_ratio NUMERIC,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  decision TEXT CHECK (decision IN ('approved', 'pending', 'rejected', 'under_review')),
  reason TEXT,
  ai_explanation TEXT,
  workflow_stage TEXT DEFAULT 'intake' CHECK (workflow_stage IN ('intake', 'kyc_verification', 'credit_scoring', 'decision', 'completed')),
  assigned_to TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'approved', 'rejected', 'disbursed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- AGENT LOGS TABLE (AI Agent Activity Tracking)
-- ==========================================
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('intake', 'kyc', 'credit_scoring', 'decision', 'fraud_detection')),
  action TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT CHECK (status IN ('success', 'failure', 'pending')),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- DISBURSEMENT TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS disbursements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  bank_account_number TEXT,
  ifsc_code TEXT,
  disbursement_status TEXT DEFAULT 'initiated' CHECK (disbursement_status IN ('initiated', 'processing', 'completed', 'failed')),
  transaction_id TEXT,
  disbursed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_decision ON applications(decision);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_workflow_stage ON applications(workflow_stage);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verification_user_id ON kyc_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_application_id ON agent_logs(application_id);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-generate application number
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.application_number := 'LN' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('application_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS application_seq START 1;

CREATE TRIGGER set_application_number
BEFORE INSERT ON applications
FOR EACH ROW
WHEN (NEW.application_number IS NULL)
EXECUTE FUNCTION generate_application_number();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE disbursements ENABLE ROW LEVEL SECURITY;

-- Demo policies (allow all for prototype)
-- In production, implement proper user authentication
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kyc_documents" ON kyc_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on kyc_verification" ON kyc_verification FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on agent_logs" ON agent_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on disbursements" ON disbursements FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- VIEWS FOR ANALYTICS
-- ==========================================

-- Application statistics
CREATE OR REPLACE VIEW application_stats AS
SELECT 
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE decision = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE decision = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE decision = 'rejected') as rejected_count,
  COUNT(*) FILTER (WHERE decision = 'under_review') as under_review_count,
  AVG(risk_score) as average_risk_score,
  AVG(loan_amount) as average_loan_amount,
  AVG(loan_amount) FILTER (WHERE decision = 'approved') as avg_approved_amount,
  AVG(credit_score) as average_credit_score
FROM applications;

-- KYC verification stats
CREATE OR REPLACE VIEW kyc_stats AS
SELECT 
  COUNT(DISTINCT id) as total_users,
  COUNT(DISTINCT id) FILTER (WHERE kyc_status = 'verified') as verified_users,
  COUNT(DISTINCT id) FILTER (WHERE kyc_status = 'pending') as pending_users,
  COUNT(DISTINCT id) FILTER (WHERE kyc_status = 'rejected') as rejected_users
FROM users;

-- Daily application trends
CREATE OR REPLACE VIEW daily_application_trends AS
SELECT 
  DATE(created_at) as application_date,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE decision = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE decision = 'rejected') as rejected_count,
  AVG(risk_score) as avg_risk_score
FROM applications
GROUP BY DATE(created_at)
ORDER BY application_date DESC;

-- ==========================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ==========================================

-- Insert sample user
-- INSERT INTO users (email, name, phone, kyc_status)
-- VALUES ('test@example.com', 'Test User', '9876543210', 'verified');

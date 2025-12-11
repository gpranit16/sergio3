import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-side only

// Client for browser-side operations (reads, public APIs)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with elevated permissions for storage writes and inserts
export const supabaseServer = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

export interface LoanApplication {
  id?: string;
  name: string;
  age: number;
  employment_type: 'salaried' | 'self_employed';
  monthly_income: number;
  existing_emi: number;
  loan_type: string;
  loan_amount: number;
  tenure_months: number;
  email?: string;
  phone?: string;
  risk_score?: number;
  decision?: 'approved' | 'pending' | 'rejected';
  reason?: string;
  created_at?: string;
}

export async function saveApplication(application: LoanApplication) {
  // Generate application_number required by schema
  const datePart = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const randPart = Math.floor(1000 + Math.random() * 9000);
  const application_number = `APP-${datePart}-${randPart}`;

  const payload = {
    application_number,
    name: application.name,
    email: application.email ?? null,
    phone: application.phone ?? null,
    age: application.age,
    employment_type: application.employment_type,
    monthly_income: application.monthly_income,
    existing_emi: application.existing_emi,
    loan_type: application.loan_type,
    loan_amount: application.loan_amount,
    tenure_months: application.tenure_months,
    risk_score: application.risk_score ?? null,
    decision: application.decision ?? 'pending',
    reason: application.reason ?? null,
  };

  const { data, error } = await supabaseServer
    .from('applications')
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save application: ${error.message}`);
  }

  return data;
}

export async function getAllApplications() {
  const { data, error } = await supabaseServer
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }

  return data;
}

export async function getApplicationById(id: string) {
  const { data, error } = await supabaseServer
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch application: ${error.message}`);
  }

  return data;
}

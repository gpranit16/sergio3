// Global type definitions for the Agentic Lending System

export type EmploymentType = 'salaried' | 'self_employed';
export type DecisionType = 'approved' | 'pending' | 'rejected';
export type LoanType = 'personal' | 'home' | 'car' | 'education' | 'business';

export interface ApplicationFormData {
  name: string;
  age: number;
  employment_type: EmploymentType;
  monthly_income: number;
  existing_emi: number;
  loan_type: string;
  loan_amount: number;
  tenure_months: number;
}

export interface Application extends ApplicationFormData {
  id: string;
  risk_score: number;
  decision: DecisionType;
  reason: string;
  created_at: string;
}

export interface RiskBreakdown {
  age_impact: number;
  income_impact: number;
  emi_impact: number;
  loan_ratio_impact: number;
  employment_impact: number;
}

export interface RiskAssessmentResult {
  risk_score: number;
  decision: DecisionType;
  triggered_rules: string[];
  breakdown: RiskBreakdown;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApplicationAPIResponse extends APIResponse {
  application: Application;
  risk_assessment: RiskAssessmentResult;
}

export interface DashboardStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  average_risk_score: number;
  avg_approved_amount: number;
}

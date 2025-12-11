/**
 * =============================================================================
 * LOAN RISK SCORING ENGINE
 * =============================================================================
 * 
 * Total Score = 100 points (Additive Model - No Credit Bonus)
 * 
 * Weight Distribution:
 * - Income Score:        35 points (max)
 * - Employment Score:    20 points (max)
 * - DTI Score:           25 points (max)
 * - Age Score:           10 points (max)
 * - Loan-to-Income:      10 points (max)
 * 
 * Decision Thresholds:
 * - 85-100: Auto Approve
 * - 60-84:  Manual Review
 * - Below 60: Auto Reject
 * 
 * =============================================================================
 */

export interface RiskAssessment {
  risk_score: number;
  decision: 'approved' | 'pending' | 'rejected';
  triggered_rules: string[];
  breakdown: {
    income_score: number;
    employment_score: number;
    dti_score: number;
    age_score: number;
    lti_score: number;
  };
}

export interface ApplicationData {
  age: number;
  employment_type: 'salaried' | 'self_employed' | string;
  monthly_income: number;
  existing_emi: number;
  loan_amount: number;
  tenure_months: number;
}

export function calculateRiskScore(application: ApplicationData): RiskAssessment {
  const triggeredRules: string[] = [];
  
  // Initialize breakdown with zeros
  const breakdown = {
    income_score: 0,
    employment_score: 0,
    dti_score: 0,
    age_score: 0,
    lti_score: 0,
  };

  // Calculate ratios
  const dtiRatio = application.monthly_income > 0 
    ? application.existing_emi / application.monthly_income 
    : 1;
  const ltiRatio = (application.monthly_income * application.tenure_months) > 0
    ? application.loan_amount / (application.monthly_income * application.tenure_months)
    : 1;

  // ==========================================
  // HARD REJECTION RULES (Eligibility Check)
  // ==========================================
  
  // Age must be 21-60
  if (application.age < 21) {
    triggeredRules.push('HARD REJECT: Age below 21 years - minimum age requirement not met');
    return {
      risk_score: 0,
      decision: 'rejected',
      triggered_rules: triggeredRules,
      breakdown,
    };
  }

  if (application.age > 60) {
    triggeredRules.push('HARD REJECT: Age above 60 years - exceeds maximum age limit');
    return {
      risk_score: 0,
      decision: 'rejected',
      triggered_rules: triggeredRules,
      breakdown,
    };
  }

  // Monthly income must be >= ₹20,000
  if (application.monthly_income < 20000) {
    triggeredRules.push('HARD REJECT: Monthly income below ₹20,000 - minimum income threshold not met');
    return {
      risk_score: 0,
      decision: 'rejected',
      triggered_rules: triggeredRules,
      breakdown,
    };
  }

  // Employment must be salaried or self-employed
  const empType = application.employment_type?.toLowerCase();
  if (empType !== 'salaried' && empType !== 'self_employed' && empType !== 'self-employed') {
    triggeredRules.push('HARD REJECT: Employment type must be Salaried or Self-Employed');
    return {
      risk_score: 0,
      decision: 'rejected',
      triggered_rules: triggeredRules,
      breakdown,
    };
  }

  // DTI > 50% is direct rejection
  if (dtiRatio > 0.5) {
    triggeredRules.push('HARD REJECT: Debt-to-Income ratio exceeds 50% - high debt burden');
    return {
      risk_score: 0,
      decision: 'rejected',
      triggered_rules: triggeredRules,
      breakdown,
    };
  }

  // ==========================================
  // SCORING CALCULATION (Additive Model)
  // ==========================================

  // ------------------------------------
  // 1. INCOME SCORE (Max 35 points)
  // ------------------------------------
  if (application.monthly_income >= 100000) {
    breakdown.income_score = 35;
    triggeredRules.push('Income ₹1L+ → 35 points (Excellent)');
  } else if (application.monthly_income >= 60000) {
    breakdown.income_score = 30;
    triggeredRules.push('Income ₹60K-1L → 30 points (Very Good)');
  } else if (application.monthly_income >= 40000) {
    breakdown.income_score = 24;
    triggeredRules.push('Income ₹40K-60K → 24 points (Good)');
  } else if (application.monthly_income >= 25000) {
    breakdown.income_score = 18;
    triggeredRules.push('Income ₹25K-40K → 18 points (Moderate)');
  } else if (application.monthly_income >= 20000) {
    breakdown.income_score = 12;
    triggeredRules.push('Income ₹20K-25K → 12 points (Minimum)');
  } else {
    breakdown.income_score = 0;
    triggeredRules.push('Income below ₹20K → 0 points');
  }

  // ------------------------------------
  // 2. EMPLOYMENT SCORE (Max 20 points)
  // ------------------------------------
  if (empType === 'salaried') {
    breakdown.employment_score = 20;
    triggeredRules.push('Salaried employment → 20 points (Stable income)');
  } else if (empType === 'self_employed' || empType === 'self-employed') {
    breakdown.employment_score = 15;
    triggeredRules.push('Self-employed → 15 points (Variable income)');
  } else {
    breakdown.employment_score = 0;
    triggeredRules.push('Other employment → 0 points');
  }

  // ------------------------------------
  // 3. DTI SCORE (Max 25 points)
  // DTI = existing_emi / monthly_income
  // ------------------------------------
  if (dtiRatio <= 0.1) {
    breakdown.dti_score = 25;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (≤10%) → 25 points (Excellent)`);
  } else if (dtiRatio <= 0.2) {
    breakdown.dti_score = 20;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (10-20%) → 20 points (Very Good)`);
  } else if (dtiRatio <= 0.3) {
    breakdown.dti_score = 15;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (20-30%) → 15 points (Good)`);
  } else if (dtiRatio <= 0.4) {
    breakdown.dti_score = 10;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (30-40%) → 10 points (Acceptable)`);
  } else if (dtiRatio <= 0.5) {
    breakdown.dti_score = 5;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (40-50%) → 5 points (Risky)`);
  } else {
    breakdown.dti_score = 0;
    triggeredRules.push(`DTI ${(dtiRatio * 100).toFixed(1)}% (>50%) → 0 points (Hard Reject)`);
  }

  // ------------------------------------
  // 4. AGE SCORE (Max 10 points)
  // ------------------------------------
  if (application.age >= 25 && application.age <= 45) {
    breakdown.age_score = 10;
    triggeredRules.push(`Age ${application.age} (25-45) → 10 points (Prime earning years)`);
  } else if (application.age >= 21 && application.age <= 24) {
    breakdown.age_score = 8;
    triggeredRules.push(`Age ${application.age} (21-24) → 8 points (Early career)`);
  } else if (application.age >= 46 && application.age <= 55) {
    breakdown.age_score = 6;
    triggeredRules.push(`Age ${application.age} (46-55) → 6 points (Late career)`);
  } else if (application.age >= 56 && application.age <= 60) {
    breakdown.age_score = 3;
    triggeredRules.push(`Age ${application.age} (56-60) → 3 points (Near retirement)`);
  } else {
    breakdown.age_score = 0;
    triggeredRules.push(`Age ${application.age} (outside 21-60) → 0 points (Hard Reject)`);
  }

  // ------------------------------------
  // 5. LOAN-TO-INCOME RATIO SCORE (Max 10 points)
  // LTI = loan_amount / (income × tenure_months)
  // ------------------------------------
  if (ltiRatio <= 0.3) {
    breakdown.lti_score = 10;
    triggeredRules.push(`LTI ratio ${ltiRatio.toFixed(2)} (≤0.3) → 10 points (Conservative)`);
  } else if (ltiRatio <= 0.5) {
    breakdown.lti_score = 7;
    triggeredRules.push(`LTI ratio ${ltiRatio.toFixed(2)} (0.3-0.5) → 7 points (Moderate)`);
  } else if (ltiRatio <= 0.7) {
    breakdown.lti_score = 4;
    triggeredRules.push(`LTI ratio ${ltiRatio.toFixed(2)} (0.5-0.7) → 4 points (Aggressive)`);
  } else {
    breakdown.lti_score = 0;
    triggeredRules.push(`LTI ratio ${ltiRatio.toFixed(2)} (>0.7) → 0 points (Over-leveraged)`);
  }

  // ==========================================
  // CALCULATE TOTAL SCORE
  // ==========================================
  const totalScore = 
    breakdown.income_score + 
    breakdown.employment_score + 
    breakdown.dti_score + 
    breakdown.age_score + 
    breakdown.lti_score;

  // ==========================================
  // DECISION LOGIC
  // 85-100: Auto Approve
  // 60-84:  Manual Review (Pending)
  // <60:    Auto Reject
  // ==========================================
  let decision: 'approved' | 'pending' | 'rejected';
  
  if (totalScore >= 85) {
    decision = 'approved';
    triggeredRules.push(`DECISION: Auto Approved (Score ${totalScore}/100 ≥ 85)`);
  } else if (totalScore >= 60) {
    decision = 'pending';
    triggeredRules.push(`DECISION: Manual Review Required (Score ${totalScore}/100 between 60-84)`);
  } else {
    decision = 'rejected';
    triggeredRules.push(`DECISION: Auto Rejected (Score ${totalScore}/100 < 60)`);
  }

  return {
    risk_score: totalScore,
    decision,
    triggered_rules: triggeredRules,
    breakdown,
  };
}

// Legacy breakdown property mapping for backward compatibility
export function mapBreakdownToLegacy(breakdown: RiskAssessment['breakdown']) {
  return {
    age_impact: breakdown.age_score,
    income_impact: breakdown.income_score,
    emi_impact: breakdown.dti_score,
    loan_ratio_impact: breakdown.lti_score,
    employment_impact: breakdown.employment_score,
  };
}

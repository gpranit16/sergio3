import { NextRequest, NextResponse } from 'next/server';
import { LoanApplicationSchema } from '@/lib/validation';
import { calculateRiskScore } from '@/lib/riskEngine';
import { getDecisionExplanation } from '@/lib/openrouter';
import { saveApplication, getAllApplications, getApplicationById } from '@/lib/supabase';

// POST /api/applications - Submit new loan application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[APPLICATIONS] Incoming body:', body);

    // Validate input
    const validationResult = LoanApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      console.warn('[APPLICATIONS] Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const applicationData = validationResult.data;

    // Calculate risk score and decision
    const riskAssessment = calculateRiskScore({
      age: applicationData.age,
      employment_type: applicationData.employment_type,
      monthly_income: applicationData.monthly_income,
      existing_emi: applicationData.existing_emi,
      loan_amount: applicationData.loan_amount,
      tenure_months: applicationData.tenure_months,
    });

    // Get AI explanation from DeepSeek R1
    let explanation: string | undefined = undefined;
    try {
      explanation = await getDecisionExplanation(
      {
        name: applicationData.name,
        age: applicationData.age,
        employment_type: applicationData.employment_type,
        monthly_income: applicationData.monthly_income,
        existing_emi: applicationData.existing_emi,
        loan_type: applicationData.loan_type,
        loan_amount: applicationData.loan_amount,
        tenure_months: applicationData.tenure_months,
      },
      riskAssessment.risk_score,
      riskAssessment.decision,
      riskAssessment.triggered_rules
      );
    } catch (llmError) {
      console.warn('[APPLICATIONS] Decision explanation generation failed:', llmError);
      explanation = 'Decision explanation unavailable due to model error.';
    }

    // Save to Supabase
    let savedApplication;
    try {
      savedApplication = await saveApplication({
      name: applicationData.name,
        email: applicationData.email ?? undefined,
        phone: applicationData.phone ?? undefined,
      age: applicationData.age,
      employment_type: applicationData.employment_type,
      monthly_income: applicationData.monthly_income,
      existing_emi: applicationData.existing_emi,
      loan_type: applicationData.loan_type,
      loan_amount: applicationData.loan_amount,
      tenure_months: applicationData.tenure_months,
      risk_score: riskAssessment.risk_score,
      decision: riskAssessment.decision,
      reason: explanation,
      });
    } catch (dbError) {
      console.error('[APPLICATIONS] Database save failed:', dbError);
      return NextResponse.json(
        { error: 'Database save failed', message: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      application: savedApplication,
      risk_assessment: {
        risk_score: riskAssessment.risk_score,
        decision: riskAssessment.decision,
        breakdown: riskAssessment.breakdown,
        triggered_rules: riskAssessment.triggered_rules,
      },
    });
  } catch (error) {
    console.error('[APPLICATIONS] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process application',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/applications - Get all applications or specific one by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get specific application
      const application = await getApplicationById(id);
      return NextResponse.json({ success: true, application });
    } else {
      // Get all applications
      const applications = await getAllApplications();
      return NextResponse.json({ success: true, applications });
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch applications',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

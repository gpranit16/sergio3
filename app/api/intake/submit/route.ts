import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateRiskScore } from '@/lib/riskEngine';
import { kycVerificationAgent, fraudDetectionAgent, creditScoringAgent, enhancedDecisionAgent } from '@/lib/aiAgents';
import { performFaceMatch } from '@/lib/documentUtils';

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    // Step 1: Create or get user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        email: applicationData.email,
        name: applicationData.name,
        phone: applicationData.phone,
        kyc_status: 'pending',
      }, {
        onConflict: 'email',
      })
      .select()
      .single();

    if (userError) throw new Error(`User creation failed: ${userError.message}`);

    const user_id = userData.id;

    // Step 2: Get uploaded documents
    const { data: documents } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', user_id);

    const aadhaarDoc = documents?.find(d => d.document_type === 'aadhaar');
    const panDoc = documents?.find(d => d.document_type === 'pan');
    const selfieDoc = documents?.find(d => d.document_type === 'selfie');

    // Step 3: AI-powered KYC verification
    const kycResult = await kycVerificationAgent({
      aadhaar_ocr: aadhaarDoc?.ocr_data,
      pan_ocr: panDoc?.ocr_data,
      selfie_url: selfieDoc?.file_url,
    });

    // Step 4: Face matching
    let faceMatchResult = null;
    if (selfieDoc && aadhaarDoc) {
      faceMatchResult = await performFaceMatch(
        selfieDoc.file_url,
        aadhaarDoc.file_url
      );
    }

    // Step 5: Store KYC verification
    await supabase.from('kyc_verification').insert({
      user_id,
      aadhaar_number: aadhaarDoc?.ocr_data?.aadhaar_number,
      aadhaar_name: aadhaarDoc?.ocr_data?.name,
      pan_number: panDoc?.ocr_data?.pan_number,
      pan_name: panDoc?.ocr_data?.name,
      face_match_score: faceMatchResult?.confidence,
      face_match_status: faceMatchResult?.match ? 'match' : 'no_match',
      fraud_check_status: 'pending',
    });

    // Step 6: Calculate risk score
    const riskAssessment = calculateRiskScore({
      age: applicationData.age,
      employment_type: applicationData.employment_type,
      monthly_income: applicationData.monthly_income,
      existing_emi: applicationData.existing_emi || 0,
      loan_amount: applicationData.loan_amount,
      tenure_months: applicationData.tenure_months,
    });

    // Step 7: Fraud detection
    const fraudCheck = await fraudDetectionAgent(applicationData, kycResult.data);

    // Step 8: Credit scoring
    const creditScore = await creditScoringAgent({
      monthly_income: applicationData.monthly_income,
      existing_emi: applicationData.existing_emi || 0,
      employment_type: applicationData.employment_type,
      age: applicationData.age,
      loan_amount: applicationData.loan_amount,
    });

    // Step 9: Final AI decision
    const finalDecision = await enhancedDecisionAgent(
      applicationData,
      kycResult.data,
      creditScore.data,
      fraudCheck.data,
      riskAssessment.risk_score
    );

    // Step 10: Determine decision based on risk categories
    let decision = 'under_review';
    if (riskAssessment.risk_score >= 70) {
      decision = 'approved'; // Low Risk (70-100)
    } else if (riskAssessment.risk_score >= 40) {
      decision = 'under_review'; // Medium Risk (40-70)
    } else {
      decision = 'rejected'; // High Risk (0-40)
    }

    // Override with AI decision if available
    if (finalDecision.success && finalDecision.data.decision) {
      decision = finalDecision.data.decision;
    }

    // Step 11: Create application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        user_id,
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        age: applicationData.age,
        employment_type: applicationData.employment_type,
        monthly_income: applicationData.monthly_income,
        existing_emi: applicationData.existing_emi || 0,
        credit_score: creditScore.data?.credit_score || 700,
        loan_type: applicationData.loan_type || 'personal',
        loan_amount: applicationData.loan_amount,
        tenure_months: applicationData.tenure_months,
        eligible_amount: creditScore.data?.eligible_amount,
        debt_to_income_ratio: creditScore.data?.debt_to_income_ratio,
        risk_score: riskAssessment.risk_score,
        decision,
        reason: finalDecision.data?.explanation || riskAssessment.triggered_rules.join('; '),
        ai_explanation: finalDecision.data?.explanation,
        workflow_stage: 'completed',
        status: decision === 'approved' ? 'approved' : decision === 'rejected' ? 'rejected' : 'processing',
      })
      .select()
      .single();

    if (appError) throw new Error(`Application creation failed: ${appError.message}`);

    // Step 12: Log all agent activities
    const agentLogs = [
      { agent_type: 'kyc', action: 'verification', output_data: kycResult.data, status: 'success' },
      { agent_type: 'fraud_detection', action: 'check', output_data: fraudCheck.data, status: 'success' },
      { agent_type: 'credit_scoring', action: 'score', output_data: creditScore.data, status: 'success' },
      { agent_type: 'decision', action: 'final_decision', output_data: finalDecision.data, status: 'success' },
    ];

    for (const log of agentLogs) {
      await supabase.from('agent_logs').insert({
        application_id: application.id,
        ...log,
      });
    }

    // Update user KYC status
    await supabase
      .from('users')
      .update({ kyc_status: kycResult.data?.verification_status || 'pending' })
      .eq('id', user_id);

    return NextResponse.json({
      success: true,
      application_id: application.id,
      application_number: application.application_number,
      decision,
      risk_score: riskAssessment.risk_score,
      risk_category: riskAssessment.risk_score >= 70 ? 'Low Risk' : riskAssessment.risk_score >= 40 ? 'Medium Risk' : 'High Risk',
      explanation: finalDecision.data?.explanation || 'Application processed',
      next_steps: finalDecision.data?.next_steps,
    });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Submission failed',
      },
      { status: 500 }
    );
  }
}

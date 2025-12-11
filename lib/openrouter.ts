import { LoanApplication } from './supabase';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function getDecisionExplanation(
  application: LoanApplication,
  riskScore: number,
  decision: 'approved' | 'pending' | 'rejected',
  triggeredRules: string[]
): Promise<string> {
  const prompt = `You are a professional loan officer explaining a loan decision to an applicant.

Application Details:
- Name: ${application.name}
- Age: ${application.age}
- Employment: ${application.employment_type}
- Monthly Income: ₹${application.monthly_income.toLocaleString()}
- Existing EMI: ₹${application.existing_emi.toLocaleString()}
- Loan Amount: ₹${application.loan_amount.toLocaleString()}
- Tenure: ${application.tenure_months} months

Risk Assessment:
- Risk Score: ${riskScore}/100
- Decision: ${decision.toUpperCase()}

Key Factors:
${triggeredRules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')}

Provide a brief, empathetic explanation (2-4 sentences) in simple language explaining why this decision was made. Be professional, clear, and human. Do NOT mention the risk score number - focus on the key factors that influenced the decision.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Error getting explanation from Gemini:', error);
    
    // Fallback explanation
    if (decision === 'approved') {
      return `Congratulations ${application.name}! Your loan application has been approved. Your stable income profile and manageable debt obligations make you an ideal candidate for this loan.`;
    } else if (decision === 'pending') {
      return `Dear ${application.name}, your application requires additional review. While you meet basic criteria, certain factors need further assessment. Our team will contact you within 2-3 business days.`;
    } else {
      return `Dear ${application.name}, unfortunately we cannot approve your loan at this time. ${triggeredRules[0] || 'Your current financial profile does not meet our lending criteria.'} We encourage you to reapply once your financial situation improves.`;
    }
  }
}

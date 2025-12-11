// AI Agents for Agentic Lending System
// Uses Google Gemini API

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  execution_time: number;
}

// Helper function to call Gemini API
async function callGemini(prompt: string): Promise<string | null> {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    console.error('[GEMINI] API error:', data);
    return null;
  } catch (error) {
    console.error('[GEMINI] Request failed:', error);
    return null;
  }
}

// ==========================================
// SMART CONVERSATIONAL RESPONSES
// ==========================================
const conversationalResponses = {
  greeting: [
    "Hello! 👋 I'm El Profesor, your AI loan assistant at La Casa de Loans. I'm here to help you navigate through your loan application process smoothly. To get started, may I know your name?",
    "Welcome to La Casa de Loans! 🎭 I'm your dedicated AI assistant, here to make your loan journey seamless. Let's begin - what's your name?",
    "¡Hola! Welcome to La Casa de Loans. I'm El Profesor, and I'll be guiding you through a quick and easy loan application. First, could you share your name with me?"
  ],
  
  afterName: (name: string) => [
    `Wonderful to meet you, ${name}! 🙌 Now, for regulatory compliance, I'll need to verify your age. How old are you?`,
    `Great to have you here, ${name}! Before we proceed, could you tell me your age? This helps us determine the best loan options for you.`,
    `Thanks ${name}! To ensure we offer you the right products, may I know your age?`
  ],
  
  afterAge: (age: number) => [
    `Perfect, ${age} years - you're in a great age bracket for our loan products! 💼 Now, let's understand your employment situation. Are you salaried or self-employed?`,
    `Got it! At ${age}, you have excellent eligibility across our loan categories. Quick question - what's your employment type? Salaried or self-employed?`,
    `Excellent! Being ${age} years old, you qualify for our full range of products. To customize your offer, are you currently salaried or running your own business?`
  ],
  
  afterEmployment: (type: string) => [
    `${type === 'salaried' ? 'Salaried professionals' : 'Self-employed individuals'} often get great rates! 📊 Now, what's your monthly income? This helps us calculate your loan eligibility.`,
    `Great! ${type === 'salaried' ? 'As a salaried employee' : 'Being self-employed'}, you have access to competitive rates. Could you share your monthly income in rupees?`,
    `Perfect! ${type === 'salaried' ? 'Salaried applicants' : 'Entrepreneurs like yourself'} are valued customers. What's your monthly take-home income?`
  ],
  
  afterIncome: (income: number) => [
    `₹${income.toLocaleString()} monthly - that's a healthy income! 💰 Do you have any existing EMIs or loan obligations? If yes, what's the total monthly EMI amount? (Enter 0 if none)`,
    `Great income profile! With ₹${income.toLocaleString()}/month, you have strong eligibility. Are you currently paying any EMIs? If so, what's the total monthly amount?`,
    `Excellent! A monthly income of ₹${income.toLocaleString()} opens up several loan options for you. Do you have any existing loan EMIs? (Enter the total amount or 0)`
  ],
  
  afterEmi: (emi: number) => [
    `${emi > 0 ? `Noted! ₹${emi.toLocaleString()} in existing EMIs - we'll factor this into your eligibility.` : 'Great! No existing EMIs means higher loan eligibility for you!'} 🎯 Now, how much loan amount are you looking for?`,
    `${emi > 0 ? `Got it, ₹${emi.toLocaleString()} monthly EMI obligation.` : 'Perfect, a clean slate with no existing EMIs!'} What loan amount do you have in mind?`,
    `${emi > 0 ? 'We\'ll consider your current obligations in the calculation.' : 'No existing debts - excellent!'} What's the loan amount you're seeking?`
  ],
  
  afterLoanAmount: (amount: number) => [
    `₹${amount.toLocaleString()} - understood! 📅 Finally, over how many months would you like to repay this loan? (We offer tenures from 6 to 84 months)`,
    `Got it! You're looking for a loan of ₹${amount.toLocaleString()}. What repayment tenure works best for you? Choose between 6 to 84 months.`,
    `₹${amount.toLocaleString()} noted! Last question - what loan tenure would you prefer? Longer tenure means lower EMI but more interest overall.`
  ],
  
  afterTenure: (tenure: number, applicationData: any) => [
    `Perfect! 🎉 Your application details are complete!\n\n📋 **Summary:**\n• Name: ${applicationData.name}\n• Age: ${applicationData.age} years\n• Employment: ${applicationData.employment_type}\n• Income: ₹${applicationData.monthly_income?.toLocaleString()}/month\n• Existing EMI: ₹${applicationData.existing_emi?.toLocaleString()}\n• Loan Amount: ₹${applicationData.loan_amount?.toLocaleString()}\n• Tenure: ${tenure} months\n\nNow let's proceed to document upload. Please upload your Aadhaar, PAN, and a selfie for KYC verification.`,
    `Excellent! All information collected! 🎊\n\nHere's what you've shared:\n• ${applicationData.name}, ${applicationData.age} years old\n• ${applicationData.employment_type} with ₹${applicationData.monthly_income?.toLocaleString()}/month income\n• Seeking ₹${applicationData.loan_amount?.toLocaleString()} for ${tenure} months\n\nLet's move to the document verification stage!`
  ],
  
  invalidAge: "I appreciate you sharing that, but our loan products are designed for individuals between 21-60 years of age. This is a regulatory requirement. Could you please confirm your correct age?",
  
  invalidIncome: "Thank you for sharing! However, our minimum income requirement is ₹20,000 per month. This ensures you can comfortably manage the loan repayments. Is there additional income you'd like to include?",
  
  invalidEmployment: "I need to know your employment type to proceed. Are you:\n• **Salaried** - Working for a company/organization\n• **Self-employed** - Running your own business or freelancing\n\nPlease specify which one applies to you.",
  
  clarification: "I want to make sure I understand you correctly. Could you please rephrase that? I'm looking for specific information to process your loan application.",
  
  help: "Of course! I'm here to help. 🤝\n\n**What I can assist with:**\n• Personal loan applications\n• Understanding eligibility criteria\n• Explaining loan terms and EMI\n• Guiding through document requirements\n\n**Current Requirements:**\n• Age: 21-60 years\n• Income: Minimum ₹20,000/month\n• Documents: Aadhaar, PAN, Selfie\n\nWhat would you like to know more about?"
};

// Get random response from array
const getRandomResponse = (responses: string[]) => responses[Math.floor(Math.random() * responses.length)];

// ==========================================
// INTAKE AGENT - Conversational Application
// ==========================================
export async function intakeAgent(userMessage: string, context: any): Promise<AgentResponse> {
  const startTime = Date.now();
  
  const prompt = `You are "El Profesor", a friendly and professional AI loan officer at "La Casa de Loans" - a Money Heist themed lending platform.

CURRENT APPLICATION CONTEXT:
${JSON.stringify(context, null, 2)}

CUSTOMER MESSAGE: "${userMessage}"

YOUR TASK:
1. Understand what information the customer is providing
2. Extract relevant data (name, age, employment_type, monthly_income, existing_emi, loan_amount, tenure_months)
3. Respond conversationally and warmly, like a helpful bank officer
4. If information is missing, ask for it naturally
5. Validate: Age 21-60, Income min ₹20,000, Employment: salaried/self_employed only

RESPONSE STYLE:
- Be warm, professional, and slightly witty (occasional Money Heist references are welcome)
- Use emojis sparingly but effectively
- Format numbers with Indian numbering (₹1,00,000)
- Acknowledge what the user said before asking the next question
- If user seems confused, offer help and clarification

RESPOND IN THIS EXACT JSON FORMAT (no markdown blocks):
{
  "message": "Your conversational response here",
  "extracted_data": {"field": "value"} or {},
  "completed": false,
  "next_field": "field_name_needed_next"
}

If ALL fields are collected, set "completed": true and summarize the application.`;

  try {
    const content = await callGemini(prompt);
    const execution_time = Date.now() - startTime;
    
    if (content) {
      console.log(`[INTAKE AGENT] Gemini response received`);
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return { success: true, data: parsed, execution_time };
      } catch {
        return { success: true, data: { message: content, completed: false }, execution_time };
      }
    }
  } catch (error) {
    console.log(`[INTAKE AGENT] Gemini failed:`, error);
  }

  // Enhanced Fallback with Natural Responses
  console.log('[INTAKE AGENT] Using enhanced fallback');
  const execution_time = Date.now() - startTime;
  const msg = userMessage.toLowerCase().trim();
  
  // Handle greetings
  if (!context.name && (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('start') || msg === '')) {
    return {
      success: true,
      data: {
        message: getRandomResponse(conversationalResponses.greeting),
        extracted_data: {},
        completed: false,
        next_field: 'name'
      },
      execution_time
    };
  }
  
  // Handle help requests
  if (msg.includes('help') || msg.includes('what') || msg.includes('how')) {
    return {
      success: true,
      data: {
        message: conversationalResponses.help,
        extracted_data: {},
        completed: false,
        next_field: context.name ? (context.age ? 'employment_type' : 'age') : 'name'
      },
      execution_time
    };
  }
  
  // Extract name
  if (!context.name) {
    const nameMatch = userMessage.match(/(?:(?:my name is|i am|i'm|call me|this is)\s+)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      if (name.length >= 2 && !/^\d+$/.test(name)) {
        return {
          success: true,
          data: {
            message: getRandomResponse(conversationalResponses.afterName(name)),
            extracted_data: { name },
            completed: false,
            next_field: 'age'
          },
          execution_time
        };
      }
    }
    return {
      success: true,
      data: {
        message: "I'd love to assist you better! Could you please share your name to get started?",
        extracted_data: {},
        completed: false,
        next_field: 'name'
      },
      execution_time
    };
  }
  
  // Extract age
  if (!context.age) {
    const ageMatch = userMessage.match(/\b(\d{1,2})\b/);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      if (age >= 21 && age <= 60) {
        return {
          success: true,
          data: {
            message: getRandomResponse(conversationalResponses.afterAge(age)),
            extracted_data: { age },
            completed: false,
            next_field: 'employment_type'
          },
          execution_time
        };
      }
      return {
        success: true,
        data: {
          message: conversationalResponses.invalidAge,
          extracted_data: {},
          completed: false,
          next_field: 'age'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: `Thanks ${context.name}! Could you tell me your age? This helps us determine your loan eligibility.`,
        extracted_data: {},
        completed: false,
        next_field: 'age'
      },
      execution_time
    };
  }
  
  // Extract employment type
  if (!context.employment_type) {
    if (/salaried|employed|job|company|work for|employee/i.test(msg)) {
      return {
        success: true,
        data: {
          message: getRandomResponse(conversationalResponses.afterEmployment('salaried')),
          extracted_data: { employment_type: 'salaried' },
          completed: false,
          next_field: 'monthly_income'
        },
        execution_time
      };
    }
    if (/self[\s-]?employed|business|freelance|entrepreneur|own company|startup/i.test(msg)) {
      return {
        success: true,
        data: {
          message: getRandomResponse(conversationalResponses.afterEmployment('self_employed')),
          extracted_data: { employment_type: 'self_employed' },
          completed: false,
          next_field: 'monthly_income'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: conversationalResponses.invalidEmployment,
        extracted_data: {},
        completed: false,
        next_field: 'employment_type'
      },
      execution_time
    };
  }
  
  // Extract monthly income
  if (!context.monthly_income) {
    const incomeMatch = userMessage.replace(/,/g, '').match(/\b(\d{4,})\b/);
    if (incomeMatch) {
      const income = parseInt(incomeMatch[1]);
      if (income >= 20000) {
        return {
          success: true,
          data: {
            message: getRandomResponse(conversationalResponses.afterIncome(income)),
            extracted_data: { monthly_income: income },
            completed: false,
            next_field: 'existing_emi'
          },
          execution_time
        };
      }
      return {
        success: true,
        data: {
          message: conversationalResponses.invalidIncome,
          extracted_data: {},
          completed: false,
          next_field: 'monthly_income'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: `Great, ${context.name}! Now, what's your monthly income? Please share the amount in rupees.`,
        extracted_data: {},
        completed: false,
        next_field: 'monthly_income'
      },
      execution_time
    };
  }
  
  // Extract existing EMI
  if (context.existing_emi === undefined) {
    const emiMatch = userMessage.replace(/,/g, '').match(/\b(\d+)\b/);
    if (emiMatch || msg.includes('no') || msg.includes('none') || msg.includes('zero')) {
      const emi = emiMatch ? parseInt(emiMatch[1]) : 0;
      return {
        success: true,
        data: {
          message: getRandomResponse(conversationalResponses.afterEmi(emi)),
          extracted_data: { existing_emi: emi },
          completed: false,
          next_field: 'loan_amount'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: "Do you have any existing loan EMIs? If yes, please share the total monthly EMI amount. Enter 0 if you don't have any.",
        extracted_data: {},
        completed: false,
        next_field: 'existing_emi'
      },
      execution_time
    };
  }
  
  // Extract loan amount
  if (!context.loan_amount) {
    const amountMatch = userMessage.replace(/,/g, '').match(/\b(\d{4,})\b/);
    if (amountMatch) {
      const amount = parseInt(amountMatch[1]);
      return {
        success: true,
        data: {
          message: getRandomResponse(conversationalResponses.afterLoanAmount(amount)),
          extracted_data: { loan_amount: amount },
          completed: false,
          next_field: 'tenure_months'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: "What loan amount are you looking for? Please share the amount in rupees.",
        extracted_data: {},
        completed: false,
        next_field: 'loan_amount'
      },
      execution_time
    };
  }
  
  // Extract tenure
  if (!context.tenure_months) {
    const tenureMatch = userMessage.match(/\b(\d{1,3})\b/);
    if (tenureMatch) {
      const tenure = parseInt(tenureMatch[1]);
      if (tenure >= 6 && tenure <= 84) {
        const fullContext = { ...context, tenure_months: tenure };
        return {
          success: true,
          data: {
            message: getRandomResponse(conversationalResponses.afterTenure(tenure, fullContext)),
            extracted_data: { tenure_months: tenure },
            completed: true,
            next_step: 'documents'
          },
          execution_time
        };
      }
      return {
        success: true,
        data: {
          message: "Please choose a tenure between 6 and 84 months. Shorter tenure = higher EMI but less interest. Longer tenure = lower EMI but more interest overall.",
          extracted_data: {},
          completed: false,
          next_field: 'tenure_months'
        },
        execution_time
      };
    }
    return {
      success: true,
      data: {
        message: "Finally! What loan tenure would you prefer? We offer 6 to 84 months. Tip: 36-48 months is popular for balanced EMI.",
        extracted_data: {},
        completed: false,
        next_field: 'tenure_months'
      },
      execution_time
    };
  }
  
  // Application complete
  return {
    success: true,
    data: {
      message: `Your application is ready, ${context.name}! 🎉 Let's proceed with document verification. Please upload your Aadhaar card, PAN card, and a clear selfie.`,
      extracted_data: {},
      completed: true,
      next_step: 'documents'
    },
    execution_time
  };
}

// ==========================================
// KYC AGENT - Document Verification
// ==========================================
export async function kycVerificationAgent(documents: {
  aadhaar_ocr?: any;
  pan_ocr?: any;
  selfie_url?: string;
}): Promise<AgentResponse> {
  const startTime = Date.now();

  const prompt = `You are a KYC verification specialist. Analyze the following extracted document data:

Aadhaar OCR Data: ${JSON.stringify(documents.aadhaar_ocr || {})}
PAN OCR Data: ${JSON.stringify(documents.pan_ocr || {})}

Verify:
1. Name match between Aadhaar and PAN (fuzzy matching allowed)
2. Aadhaar number format (12 digits)
3. PAN number format (10 characters)
4. Age calculation from DOB
5. Any inconsistencies or red flags

Return ONLY valid JSON (no markdown):
{
  "verification_status": "verified" | "rejected" | "needs_review",
  "name_match": true/false,
  "aadhaar_valid": true/false,
  "pan_valid": true/false,
  "age": number,
  "issues": ["list of issues if any"],
  "confidence_score": 0-100
}`;

  try {
    const content = await callGemini(prompt);
    const execution_time = Date.now() - startTime;

    if (content) {
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return { success: true, data: parsed, execution_time };
      } catch {
        return {
          success: true,
          data: {
            verification_status: 'needs_review',
            confidence_score: 50,
            issues: ['AI parsing error'],
          },
          execution_time,
        };
      }
    }

    return { success: false, error: 'Invalid response from AI', execution_time };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      execution_time: Date.now() - startTime,
    };
  }
}

// ==========================================
// FRAUD DETECTION AGENT
// ==========================================
export async function fraudDetectionAgent(applicationData: any, kycData: any): Promise<AgentResponse> {
  const startTime = Date.now();

  const prompt = `You are a fraud detection specialist. Analyze this loan application for red flags:

Application: ${JSON.stringify(applicationData)}
KYC Data: ${JSON.stringify(kycData)}

Check for:
1. Unrealistic income for age/employment
2. Suspiciously round numbers
3. Mismatched information
4. Pattern anomalies
5. High-risk indicators

Return ONLY valid JSON (no markdown):
{
  "fraud_risk": "low" | "medium" | "high",
  "risk_score": 0-100,
  "flags": ["list of concerns"],
  "recommendation": "approve" | "review" | "reject"
}`;

  try {
    const content = await callGemini(prompt);
    const execution_time = Date.now() - startTime;

    if (content) {
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return { success: true, data: parsed, execution_time };
      } catch {
        return {
          success: true,
          data: { fraud_risk: 'low', risk_score: 20, flags: [], recommendation: 'approve' },
          execution_time,
        };
      }
    }

    return { success: false, error: 'Invalid response', execution_time };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      execution_time: Date.now() - startTime,
    };
  }
}

// ==========================================
// CREDIT SCORING AGENT (ML Simulation)
// ==========================================
export async function creditScoringAgent(financialData: {
  monthly_income: number;
  existing_emi: number;
  employment_type: string;
  age: number;
  loan_amount: number;
}): Promise<AgentResponse> {
  const startTime = Date.now();

  const prompt = `You are a credit risk analyst. Calculate a credit score (300-900 scale) based on:

Income: ₹${financialData.monthly_income}
Existing EMI: ₹${financialData.existing_emi}
Employment: ${financialData.employment_type}
Age: ${financialData.age}
Requested Loan: ₹${financialData.loan_amount}

Scoring factors (PRD guidelines):
- Income strength: 30%
- Debt-to-income ratio: 30%
- Employment stability: 20%
- Age factor: 20%

Calculate:
1. Credit score (300-900)
2. Eligible loan amount = (monthly_income * 20) - existing_emi
3. Debt-to-income ratio
4. Risk category

Return ONLY valid JSON (no markdown):
{
  "credit_score": number,
  "eligible_amount": number,
  "debt_to_income_ratio": number,
  "risk_category": "low" | "medium" | "high",
  "recommendation": "approve" | "review" | "reject"
}`;

  try {
    const content = await callGemini(prompt);
    const execution_time = Date.now() - startTime;

    if (content) {
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return { success: true, data: parsed, execution_time };
      } catch {
        // Fallback calculation
        const dti = financialData.existing_emi / financialData.monthly_income;
        const eligible = (financialData.monthly_income * 20) - financialData.existing_emi;
        
        return {
          success: true,
          data: {
            credit_score: 700,
            eligible_amount: Math.max(0, eligible),
            debt_to_income_ratio: dti,
            risk_category: dti > 0.4 ? 'high' : dti > 0.3 ? 'medium' : 'low',
            recommendation: dti > 0.4 ? 'reject' : 'review',
          },
          execution_time,
        };
      }
    }

    return { success: false, error: 'Invalid response', execution_time };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      execution_time: Date.now() - startTime,
    };
  }
}

// ==========================================
// DECISION AGENT (Enhanced Explainability)
// ==========================================
export async function enhancedDecisionAgent(
  application: any,
  kycResult: any,
  creditScore: any,
  fraudCheck: any,
  riskScore: number
): Promise<AgentResponse> {
  const startTime = Date.now();

  const prompt = `You are the final decision maker for a loan application. Provide a comprehensive, explainable decision.

Application Summary:
- Name: ${application.name}
- Age: ${application.age}
- Income: ₹${application.monthly_income}
- Loan Requested: ₹${application.loan_amount}

Assessment Results:
- KYC Status: ${kycResult.verification_status}
- Credit Score: ${creditScore.credit_score}
- Fraud Risk: ${fraudCheck.fraud_risk}
- Risk Score: ${riskScore}/100

Decision Criteria (PRD):
- Credit Score ≥750: Auto-approve
- Credit Score 650-749: Review
- Credit Score <650: Reject
- Fraud Risk High: Reject
- KYC Not Verified: Reject

Provide:
1. Final decision (approved/under_review/rejected)
2. Clear explanation (2-4 sentences)
3. Specific reasons
4. Next steps for applicant

Return JSON:
{
  "decision": "approved" | "under_review" | "rejected",
  "explanation": "human-friendly explanation",
  "reasons": ["reason 1", "reason 2"],
  "next_steps": "what happens next",
  "eligible_amount": number or null
}`;

  try {
    const content = await callGemini(prompt);
    const execution_time = Date.now() - startTime;

    if (content) {
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        return { success: true, data: parsed, execution_time };
      } catch {
        return {
          success: true,
          data: {
            decision: 'under_review',
            explanation: content,
            reasons: ['Manual review required'],
            next_steps: 'Our team will contact you within 24-48 hours',
          },
          execution_time,
        };
      }
    }

    return { success: false, error: 'Invalid response', execution_time };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      execution_time: Date.now() - startTime,
    };
  }
}

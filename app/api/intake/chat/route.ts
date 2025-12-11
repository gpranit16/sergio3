import { NextRequest, NextResponse } from 'next/server';
import { intakeAgent } from '@/lib/aiAgents';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // Call the intake AI agent
    const result = await intakeAgent(message, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Determine next step based on completeness
    const response = result.data;
    
    // Check if we have all required fields
    const hasAllFields = context.name && context.age && context.employment_type && 
                        context.monthly_income && context.loan_amount;

    if (hasAllFields && !response.next_step) {
      response.next_step = 'documents';
      response.message += '\n\n📄 Great! Now let\'s upload your documents: Aadhaar, PAN, Salary Slip, Bank Statement, and a Selfie for verification.';
    }

    return NextResponse.json({
      success: true,
      response,
      execution_time: result.execution_time,
    });
  } catch (error) {
    console.error('Intake chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const application_id = searchParams.get('application_id');

    if (!application_id) {
      return NextResponse.json(
        { success: false, error: 'Application ID required' },
        { status: 400 }
      );
    }

    // Get KYC verification data directly from kyc_verification table
    const { data: kyc, error: kycError } = await supabaseServer
      .from('kyc_verification')
      .select('*')
      .eq('application_id', application_id)
      .maybeSingle();

    // Also get document verification data
    const { data: documents } = await supabaseServer
      .from('document_verification')
      .select('*')
      .eq('application_id', application_id);

    return NextResponse.json({
      success: true,
      kyc: kyc || {
        aadhaar_number: 'XXXX-XXXX-XXXX',
        pan_number: 'XXXXXXXXXX',
        face_match_status: 'pending',
        face_match_score: 0,
        fraud_check_status: 'pending',
        fraud_flags: [],
      },
      documents: documents || [],
    });
  } catch (error) {
    console.error('KYC fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch KYC data',
      },
      { status: 500 }
    );
  }
}

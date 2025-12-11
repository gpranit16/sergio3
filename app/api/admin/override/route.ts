import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { application_id, new_decision, reason } = await request.json();

    console.log('[ADMIN OVERRIDE] Request:', { application_id, new_decision, reason });

    if (!application_id || !new_decision) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current application state first
    const { data: currentApp, error: fetchError } = await supabaseServer
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (fetchError) {
      console.error('[ADMIN OVERRIDE] Fetch error:', fetchError);
      throw fetchError;
    }

    const previous_decision = currentApp?.decision;

    // Update application decision
    const { data, error } = await supabaseServer
      .from('applications')
      .update({
        decision: new_decision,
        reviewed_by: 'admin',
        reviewed_at: new Date().toISOString(),
        status: new_decision === 'approved' ? 'approved' : new_decision === 'rejected' ? 'rejected' : 'processing',
        reason: reason || currentApp?.reason,
      })
      .eq('id', application_id)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN OVERRIDE] Update error:', error);
      throw error;
    }

    console.log('[ADMIN OVERRIDE] Updated successfully:', data);

    // Log the override action
    await supabaseServer.from('agent_logs').insert({
      application_id,
      agent_type: 'decision',
      action: 'admin_override',
      input_data: { previous_decision, new_decision, reason },
      output_data: { decision: new_decision },
      status: 'success',
    });

    // Also log to decision_audit_trail if table exists
    try {
      await supabaseServer.from('decision_audit_trail').insert({
        application_id,
        decision: new_decision,
        decision_maker: 'admin',
        decision_type: 'manual_override',
        previous_decision,
        override_reason: reason,
        risk_score: currentApp?.risk_score,
      });
    } catch (auditError) {
      console.warn('[ADMIN OVERRIDE] Audit trail insert failed:', auditError);
    }

    return NextResponse.json({
      success: true,
      application: data,
      message: `Decision updated to ${new_decision}`,
    });
  } catch (error) {
    console.error('[ADMIN OVERRIDE] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Override failed',
      },
      { status: 500 }
    );
  }
}

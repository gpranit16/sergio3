import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET /api/admin/application - Get application details by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const { data: application, error } = await supabaseServer
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[ADMIN GET] Error fetching application:', error);
      return NextResponse.json(
        { error: 'Application not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('[ADMIN GET] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/application - Update application details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { application_id, updates, admin_note } = body;

    if (!application_id) {
      return NextResponse.json(
        { error: 'application_id is required' },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    // Allowed fields to update
    const allowedFields = [
      'name',
      'email',
      'phone',
      'age',
      'employment_type',
      'monthly_income',
      'existing_emi',
      'loan_amount',
      'tenure_months',
      'loan_type',
      'risk_score',
      'credit_score',
      'decision',
      'status',
      'workflow_stage',
      'ai_explanation',
    ];

    // Filter only allowed fields
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    // Update the application
    const { data: updatedApp, error } = await supabaseServer
      .from('applications')
      .update(filteredUpdates)
      .eq('id', application_id)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN EDIT] Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update application', details: error.message },
        { status: 500 }
      );
    }

    // Log the admin action
    try {
      await supabaseServer.from('agent_logs').insert({
        application_id,
        agent_type: 'admin_edit',
        action: 'Manual application edit by admin',
        input_data: { updates: filteredUpdates, note: admin_note },
        output_data: { updated_fields: Object.keys(filteredUpdates) },
        status: 'success',
      });
    } catch (logError) {
      console.warn('[ADMIN EDIT] Failed to log action:', logError);
    }

    return NextResponse.json({
      success: true,
      application: updatedApp,
      updated_fields: Object.keys(filteredUpdates),
    });
  } catch (error) {
    console.error('[ADMIN EDIT] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/application - Delete an application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('application_id');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'application_id is required' },
        { status: 400 }
      );
    }

    // Delete the application (cascades to related tables)
    const { error } = await supabaseServer
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('[ADMIN DELETE] Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete application', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('[ADMIN DELETE] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

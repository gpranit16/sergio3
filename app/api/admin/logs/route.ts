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

    const { data: logs, error } = await supabaseServer
      .from('agent_logs')
      .select('*')
      .eq('application_id', application_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      logs: logs || [],
    });
  } catch (error) {
    console.error('Logs fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch logs',
      },
      { status: 500 }
    );
  }
}

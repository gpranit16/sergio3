import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// GET /api/admin/documents?application_id=xxx - Get all documents for an application
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('application_id');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'application_id is required' },
        { status: 400 }
      );
    }

    // Try to fetch from application_documents first
    let documents: any[] = [];
    
    const { data: appDocs, error: appDocsError } = await supabaseServer
      .from('application_documents')
      .select('*')
      .eq('application_id', applicationId)
      .order('uploaded_at', { ascending: false });

    if (!appDocsError && appDocs && appDocs.length > 0) {
      documents = appDocs.map(doc => ({
        ...doc,
        validation_status: doc.is_valid ? 'valid' : 'invalid',
      }));
    } else {
      // Fallback to document_verification table
      const { data: verDocs, error: verDocsError } = await supabaseServer
        .from('document_verification')
        .select('*')
        .eq('application_id', applicationId)
        .order('uploaded_at', { ascending: false });

      if (!verDocsError && verDocs) {
        documents = verDocs;
      }
    }

    return NextResponse.json({
      success: true,
      documents: documents || [],
    });
  } catch (error) {
    console.error('[ADMIN DOCUMENTS] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// Approve API Route — Sets email_approved on selected candidates
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { candidateIds, approved } = await request.json();

    if (!candidateIds || !Array.isArray(candidateIds)) {
      return NextResponse.json({ error: 'candidateIds array required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('candidates')
      .update({ email_approved: approved !== false })
      .in('id', candidateIds);

    if (error) throw error;

    return NextResponse.json({ updated: candidateIds.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

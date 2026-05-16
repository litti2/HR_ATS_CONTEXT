// =============================================================================
// Reset API — Clears all candidates and logs for a fresh pipeline run
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json({ error: 'roleId required' }, { status: 400 });
    }

    // Delete all candidates for this role
    const { error: candError } = await supabase
      .from('candidates')
      .delete()
      .eq('role_id', roleId);

    if (candError) {
      console.error('Failed to delete candidates:', candError);
    }

    // Delete all processing logs for this role
    const { error: logError } = await supabase
      .from('processing_logs')
      .delete()
      .eq('role_id', roleId);

    if (logError) {
      console.error('Failed to delete logs:', logError);
    }

    // Reset role status
    await supabase.from('roles').update({ status: 'active' }).eq('id', roleId);

    return NextResponse.json({ success: true, message: 'All candidates and logs cleared for this role.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

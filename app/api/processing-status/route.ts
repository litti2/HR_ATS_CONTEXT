// =============================================================================
// Processing Status API — Returns real pipeline progress from processing_logs
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');

  if (!roleId) {
    return NextResponse.json({ error: 'roleId required' }, { status: 400 });
  }

  // Get the role status
  const { data: role } = await supabase
    .from('roles')
    .select('status')
    .eq('id', roleId)
    .single();

  // Get all processing logs for this role, ordered by timestamp
  const { data: logs, error } = await supabase
    .from('processing_logs')
    .select('stage, status, message, timestamp')
    .eq('role_id', roleId)
    .order('timestamp', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Determine overall status
  let status = 'processing';
  let errorMessage = null;

  if (role?.status === 'done') {
    status = 'done';
  } else if (role?.status === 'error') {
    status = 'error';
    const errorLog = (logs || []).find(l => l.status === 'error');
    errorMessage = errorLog?.message || 'Unknown error';
  }

  // Check if DONE stage exists in logs
  const doneLog = (logs || []).find(l => l.stage === 'DONE' && l.status === 'complete');
  if (doneLog) {
    status = 'done';
  }

  return NextResponse.json({
    status,
    logs: logs || [],
    errorMessage,
  });
}

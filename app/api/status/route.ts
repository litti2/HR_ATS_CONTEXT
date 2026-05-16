// =============================================================================
// Processing Status API Route — Polled by frontend every 5s
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');

  if (!roleId) {
    return NextResponse.json({ error: 'roleId required' }, { status: 400 });
  }

  const { data: logs } = await supabase
    .from('processing_logs')
    .select('*')
    .eq('role_id', roleId)
    .order('timestamp', { ascending: false })
    .limit(20);

  const latest = logs?.[0] || null;

  return NextResponse.json({
    currentStage: latest?.stage || null,
    currentStatus: latest?.status || null,
    message: latest?.message || null,
    logs: logs || [],
  });
}

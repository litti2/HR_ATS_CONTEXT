// =============================================================================
// Candidates API Route — Returns shortlisted candidates for results page
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get('roleId');

  if (!roleId) {
    return NextResponse.json({ error: 'roleId required' }, { status: 400 });
  }

  // Get candidates
  const { data: candidates, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('role_id', roleId)
    // Only return shortlisted if done, else return all so far
    .order('rank', { ascending: true });

  if (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }

  // Get role status
  const { data: role } = await supabase
    .from('roles')
    .select('status')
    .eq('id', roleId)
    .single();

  return NextResponse.json({ 
    candidates: candidates || [],
    roleStatus: role?.status || 'unknown'
  });
}

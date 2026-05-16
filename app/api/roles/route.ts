// =============================================================================
// Roles API Route — GET active role, POST new role config
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return NextResponse.json({ role: null });
    return NextResponse.json({ role: data });
  } catch {
    return NextResponse.json({ role: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('roles')
      .insert({
        title: body.title,
        company_name: body.company_name,
        company_email: body.company_email,
        jd_text: body.jd_text,
        requirements_text: body.requirements_text,
        assignment_brief: body.assignment_brief,
        domain: body.domain,
        google_form_link: body.google_form_link,
        google_sheet_id: body.google_sheet_id,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Save Role Error:', error);
    return NextResponse.json({ 
      error: error.message || String(error) 
    }, { status: 500 });
  }
}

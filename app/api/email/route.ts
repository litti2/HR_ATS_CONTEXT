// =============================================================================
// Email Dispatch API Route — Sends assignment emails to approved candidates
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { dispatchApprovedEmails } from '@/lib/emailer';

export async function POST(request: NextRequest) {
  try {
    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json({ error: 'roleId required' }, { status: 400 });
    }

    const result = await dispatchApprovedEmails(roleId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

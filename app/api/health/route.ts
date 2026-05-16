// =============================================================================
// Health Check API Route
// =============================================================================

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check — will test Supabase when keys are configured
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

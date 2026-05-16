// =============================================================================
// Email Dispatch Service
// =============================================================================

import { Resend } from 'resend';
import { supabase } from '@/utils/supabaseClient';
import { EMAIL_TEMPLATES } from '@/constants/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAssignmentEmail(
  candidate: { id: string; name: string; email: string },
  role: { title: string; company_name: string; company_email: string; assignment_brief: string }
) {
  try {
    const subject = EMAIL_TEMPLATES.assignment.subject(role.title, role.company_name);
    const body = EMAIL_TEMPLATES.assignment.body(candidate.name, role.title, role.company_name, role.assignment_brief);

    await resend.emails.send({
      from: role.company_email || 'onboarding@resend.dev',
      to: candidate.email,
      subject,
      text: body,
    });

    await supabase.from('candidates').update({ email_sent: true }).eq('id', candidate.id);
    return { success: true };
  } catch (err) {
    console.error(`Email failed for ${candidate.email}:`, err);
    await supabase.from('processing_logs').insert({
      role_id: candidate.id,
      stage: 'EMAIL',
      status: 'error',
      message: `Failed to send email to ${candidate.email}: ${err}`,
    });
    return { success: false, email: candidate.email };
  }
}

export async function dispatchApprovedEmails(roleId: string) {
  const { data: role } = await supabase.from('roles').select('*').eq('id', roleId).single();
  if (!role) throw new Error('Role not found');

  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, email')
    .eq('role_id', roleId)
    .eq('shortlisted', true)
    .eq('email_approved', true)
    .eq('email_sent', false);

  let sent = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  for (const candidate of (candidates || [])) {
    const result = await sendAssignmentEmail(candidate, role);
    if (result.success) {
      sent++;
    } else {
      failed++;
      if (result.email) failedEmails.push(result.email);
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  return { sent, failed, failedEmails };
}

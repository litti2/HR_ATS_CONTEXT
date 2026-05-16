// =============================================================================
// Email Templates — Assignment email sent to shortlisted candidates
// =============================================================================

export const EMAIL_TEMPLATES = {
  assignment: {
    subject: (roleTitle: string, companyName: string) =>
      `Your Application for ${roleTitle} at ${companyName} — Next Steps`,

    body: (candidateName: string, roleTitle: string, companyName: string, assignmentBrief: string) =>
      `Hi ${candidateName},

Thank you for applying for the ${roleTitle} position at ${companyName}. We were impressed with your profile and would like to move forward with the next step in our evaluation process.

As part of our hiring process, we'd like you to complete the following assignment:

${assignmentBrief}

Please submit your completed assignment within 7 days of receiving this email.

If you have any questions, feel free to reply to this email.

Best regards,
The ${companyName} Hiring Team`,
  },
} as const;

// =============================================================================
// Mask PII — Hides email and phone until recruiter approves
// =============================================================================

export function maskEmail(email: string): string {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local[0] + '***';
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return '***';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return '***';
  return digits.slice(0, 3) + '****' + digits.slice(-3);
}

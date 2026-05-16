// =============================================================================
// App Configuration — Single source of truth for branding
// =============================================================================

export const APP_NAME = 'ContextHire';
export const APP_TAGLINE = 'Hire like a smart recruiter. Scale like a machine.';
export const APP_DESCRIPTION =
  'AI-powered contextual candidate shortlisting that replaces keyword matching with semantic reasoning — the way a smart human recruiter thinks.';
export const APP_VERSION = '1.0.0';

export const APP_CONFIG = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  description: APP_DESCRIPTION,
  version: APP_VERSION,
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

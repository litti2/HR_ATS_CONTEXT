// =============================================================================
// Candidate Type Definition
// =============================================================================

import { GitHubSummary } from './github';

export interface Candidate {
  id: string;
  role_id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  grad_year: string;
  experience_band: '0-2' | '2-4' | '4+';
  linkedin_url: string;
  github_url: string;
  resume_pdf_url: string | null;
  resume_text: string | null;
  github_summary: GitHubSummary | null;
  domain_signals: string[];
  primary_domain: string | null;
  llm_profile_summary: string | null;
  fit_reasoning: string | null;
  resume_context_score: number | null;
  github_signal_score: number | null;
  domain_alignment_score: number | null;
  experience_score: number | null;
  college_tier_score: number | null;
  total_score: number | null;
  rank: number | null;
  shortlisted: boolean;
  email_approved: boolean;
  email_sent: boolean;
  created_at: string;
}

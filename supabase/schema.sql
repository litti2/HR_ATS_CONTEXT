-- =============================================================================
-- Google Antigravity — Supabase Schema
-- =============================================================================
-- Run this in Supabase SQL Editor to create all required tables.
-- =============================================================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  company_name      text,
  company_email     text,
  jd_text           text,
  requirements_text text,
  assignment_brief  text,
  domain            text,
  google_form_link  text,
  google_sheet_id   text,
  status            text DEFAULT 'active',
  created_at        timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id                uuid REFERENCES roles(id) ON DELETE CASCADE,
  name                   text,
  email                  text,
  phone                  text,
  college                text,
  degree                 text,
  grad_year              text,
  experience_band        text,
  linkedin_url           text,
  github_url             text,
  resume_pdf_url         text,
  resume_text            text,
  github_summary         jsonb,
  domain_signals         text[],
  primary_domain         text,
  llm_profile_summary    text,
  fit_reasoning          text,
  resume_context_score   float4,
  github_signal_score    float4,
  domain_alignment_score float4,
  experience_score       float4,
  college_tier_score     float4,
  total_score            float4,
  rank                   int4,
  shortlisted            bool DEFAULT false,
  email_approved         bool DEFAULT false,
  email_sent             bool DEFAULT false,
  created_at             timestamptz DEFAULT now()
);

-- Processing logs table
CREATE TABLE IF NOT EXISTS processing_logs (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id   uuid REFERENCES roles(id) ON DELETE CASCADE,
  stage     text,
  status    text,
  message   text,
  timestamp timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_candidates_role_id ON candidates(role_id);
CREATE INDEX IF NOT EXISTS idx_candidates_shortlisted ON candidates(shortlisted);
CREATE INDEX IF NOT EXISTS idx_candidates_total_score ON candidates(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_email_sent ON candidates(email_sent);
CREATE INDEX IF NOT EXISTS idx_processing_logs_role_id ON processing_logs(role_id);
CREATE INDEX IF NOT EXISTS idx_processing_logs_timestamp ON processing_logs(timestamp DESC);

-- Enable Row Level Security (allow all via service role for V1)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies — allow service role full access
CREATE POLICY "Service role full access" ON roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON candidates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON processing_logs FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for resumes (run separately in Supabase Dashboard)
-- Supabase Dashboard → Storage → New bucket → Name: "resumes" → Private

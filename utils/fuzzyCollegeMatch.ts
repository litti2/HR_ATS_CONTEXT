// =============================================================================
// Fuzzy College Match — Matches candidate college against tier list
// =============================================================================

import { COLLEGE_TIERS, DEFAULT_TIER, DEFAULT_TIER_SCORE } from '@/constants/collegeTiers';

export interface CollegeMatchResult {
  tier: number;
  score: number;
  matched: string | null;
}

export function fuzzyCollegeMatch(collegeName: string): CollegeMatchResult {
  if (!collegeName) {
    return { tier: DEFAULT_TIER, score: DEFAULT_TIER_SCORE, matched: null };
  }

  const normalized = collegeName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Expand abbreviations
    .replace(/\biit\s*b\b/, 'iit bombay')
    .replace(/\biit\s*d\b/, 'iit delhi')
    .replace(/\biit\s*m\b/, 'iit madras')
    .replace(/\biit\s*k\b/, 'iit kanpur')
    .replace(/\biit\s*kgp\b/, 'iit kharagpur')
    .replace(/\biit\s*r\b/, 'iit roorkee')
    .replace(/\biit\s*g\b/, 'iit guwahati')
    .replace(/\biit\s*h\b/, 'iit hyderabad')
    .replace(/\bnit\s*t\b/, 'nit trichy')
    .replace(/\bnit\s*w\b/, 'nit warangal')
    .replace(/\bnit\s*k\b/, 'nit karnataka');

  // Check tiers in order (Tier 1 → Tier 2 → Tier 3)
  for (const tier of COLLEGE_TIERS) {
    for (const keyword of tier.keywords) {
      if (normalized.includes(keyword)) {
        return { tier: tier.tier, score: tier.score, matched: keyword };
      }
    }
  }

  return { tier: DEFAULT_TIER, score: DEFAULT_TIER_SCORE, matched: null };
}

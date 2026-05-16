// =============================================================================
// Domain Signal Classification Service
// =============================================================================

import { DOMAIN_SIGNALS } from '@/constants/domainSignals';
import { supabase } from '@/utils/supabaseClient';
import type { GitHubSummary } from '@/types/github';

export function classifyDomain(resumeText: string, githubSummary: GitHubSummary | null) {
  // Build corpus from resume + GitHub languages
  let corpus = (resumeText || '').toLowerCase();
  if (githubSummary?.languages) {
    corpus += ' ' + githubSummary.languages.map((l) => l.language.toLowerCase()).join(' ');
  }

  // Count hits per domain
  const hits: Record<string, { count: number; matched: string[] }> = {};
  for (const [domain, keywords] of Object.entries(DOMAIN_SIGNALS)) {
    const matched: string[] = [];
    for (const kw of keywords) {
      if (corpus.includes(kw.toLowerCase())) {
        matched.push(kw);
      }
    }
    hits[domain] = { count: matched.length, matched };
  }

  // Determine primary domain
  const sorted = Object.entries(hits).sort((a, b) => b[1].count - a[1].count);
  let primaryDomain = sorted[0]?.[0] || 'fullstack';

  // Check for fullstack: if frontend + backend are both high and close
  const frontendHits = hits.frontend?.count || 0;
  const backendHits = hits.backend?.count || 0;
  if (frontendHits > 3 && backendHits > 3) {
    const ratio = Math.min(frontendHits, backendHits) / Math.max(frontendHits, backendHits);
    if (ratio > 0.6) {
      primaryDomain = 'fullstack';
    }
  }

  // Map domain key to our DomainType
  const domainMap: Record<string, string> = { mlAI: 'ml-ai' };
  primaryDomain = domainMap[primaryDomain] || primaryDomain;

  // Collect all matched signals as tags
  const allSignals = Object.values(hits).flatMap((h) => h.matched).slice(0, 15);

  return { primaryDomain, domainSignals: allSignals };
}

export async function classifyAllDomains(roleId: string) {
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, resume_text, github_summary')
    .eq('role_id', roleId);

  let classified = 0;
  for (const c of (candidates || [])) {
    const { primaryDomain, domainSignals } = classifyDomain(c.resume_text, c.github_summary);
    await supabase.from('candidates').update({
      primary_domain: primaryDomain,
      domain_signals: domainSignals,
    }).eq('id', c.id);
    classified++;
  }

  return { classified };
}

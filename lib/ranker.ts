// =============================================================================
// Ranking & Shortlisting Engine
// =============================================================================

import { SCORING_WEIGHTS } from '@/constants/scoringWeights';
import { supabase } from '@/utils/supabaseClient';

export function computeTotalScore(candidate: {
  resume_context_score: number | null;
  domain_alignment_score: number | null;
  github_signal_score: number | null;
  experience_score: number | null;
  college_tier_score: number | null;
}): number {
  const rc = candidate.resume_context_score ?? 0;
  const da = candidate.domain_alignment_score ?? 0;
  const gh = candidate.github_signal_score ?? 0;
  const ex = candidate.experience_score ?? 0;
  const ct = candidate.college_tier_score ?? 2;

  // Each sub-score is on a 0-5 scale
  // Weighted sum produces a 0-5 total, then scale to 0-100
  const weightedSum =
    rc * SCORING_WEIGHTS.resumeContext +
    da * SCORING_WEIGHTS.domainAlignment +
    gh * SCORING_WEIGHTS.githubSignal +
    ex * SCORING_WEIGHTS.experience +
    ct * SCORING_WEIGHTS.collegeTier;

  // Scale from 0-5 to 0-100
  const totalScore = (weightedSum / 5) * 100;

  return Math.round(totalScore * 10) / 10; // 1 decimal place
}

export async function rankCandidates(roleId: string) {
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, resume_context_score, domain_alignment_score, github_signal_score, experience_score, college_tier_score')
    .eq('role_id', roleId);

  if (!candidates || candidates.length === 0) {
    console.log('[Ranker] No candidates to rank');
    return { ranked: 0, shortlisted: 0 };
  }

  console.log(`[Ranker] Computing scores for ${candidates.length} candidates`);

  // Compute total scores
  const scored = candidates.map((c) => ({
    id: c.id,
    name: c.name,
    total_score: computeTotalScore(c),
    college_tier_score: c.college_tier_score ?? 2,
  }));

  // Sort: total_score desc, college_tier_score desc as tiebreaker
  scored.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return b.college_tier_score - a.college_tier_score;
  });

  // Assign ranks and shortlist top 50
  let shortlistedCount = 0;
  for (let i = 0; i < scored.length; i++) {
    const rank = i + 1;
    const shortlisted = rank <= 50;
    if (shortlisted) shortlistedCount++;

    console.log(`[Ranker] #${rank}: ${scored[i].name} — Score: ${scored[i].total_score}`);

    await supabase.from('candidates').update({
      total_score: scored[i].total_score,
      rank,
      shortlisted,
    }).eq('id', scored[i].id);
  }

  console.log(`[Ranker] Complete: ${scored.length} ranked, ${shortlistedCount} shortlisted`);
  return { ranked: scored.length, shortlisted: shortlistedCount };
}

// =============================================================================
// College Tier Scoring Service
// =============================================================================

import { fuzzyCollegeMatch } from '@/utils/fuzzyCollegeMatch';
import { supabase } from '@/utils/supabaseClient';

export function scoreCollege(collegeName: string) {
  return fuzzyCollegeMatch(collegeName);
}

export async function scoreAllColleges(roleId: string) {
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, college')
    .eq('role_id', roleId);

  let scored = 0;
  for (const c of (candidates || [])) {
    const result = scoreCollege(c.college);
    await supabase.from('candidates').update({
      college_tier_score: result.score,
    }).eq('id', c.id);
    scored++;
  }

  return { scored };
}

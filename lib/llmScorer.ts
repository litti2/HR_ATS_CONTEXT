// =============================================================================
// LLM Scoring Service — Core intelligence module (Gemini Edition)
// =============================================================================
// Handles rate limits gracefully with a hard cap on total wait time.
// If quota is exhausted, skips scoring instead of retrying forever.

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/utils/supabaseClient';
import type { Role } from '@/types/role';

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.warn('[LLM] WARNING: GEMINI_API_KEY is not set! LLM scoring will fail.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Models to try, in priority order
const MODEL_PRIORITY = ['gemini-2.0-flash-lite', 'gemini-2.0-flash'];

function getModel(modelName: string) {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
}

const SYSTEM_PROMPT = `You are a senior technical recruiter and engineering manager with 15 years of experience. Your job is to evaluate candidates for a specific engineering role based on context from their resume, GitHub activity, and background — not just keywords.

You must reason about depth of experience, domain alignment, trajectory, and quality of work. Return your evaluation as a single valid JSON object with no markdown formatting.`;

function buildUserPrompt(candidate: any, role: Role): string {
  return `Evaluate this candidate for the following role:

ROLE: ${role.title}
DOMAIN: ${role.domain}
JOB DESCRIPTION: ${role.jd_text}
REQUIREMENTS: ${role.requirements_text}

CANDIDATE PROFILE:
- Name: ${candidate.name}
- College: ${candidate.college} (Tier Score: ${candidate.college_tier_score ?? 'unscored'}/5)
- Degree: ${candidate.degree}
- Graduation Year: ${candidate.grad_year}
- Experience: ${candidate.experience_band} years
- Domain Signals Detected: ${(candidate.domain_signals || []).join(', ') || 'none detected'}
- Primary Domain Classification: ${candidate.primary_domain || 'unknown'}

RESUME TEXT:
${(candidate.resume_text || 'No resume text available.').substring(0, 6000)}

GITHUB SUMMARY:
${JSON.stringify(candidate.github_summary || { note: 'no GitHub data available' }, null, 2).substring(0, 2500)}

Return a JSON object with exactly these fields:
{
  "profile_summary": "3-5 sentence narrative about the candidate's background, strengths, and notable achievements",
  "fit_reasoning": "Why this candidate is or isn't a good fit for this specific role, with specific evidence",
  "resume_context_score": <float 0-5>,
  "github_signal_score": <float 0-5>,
  "domain_alignment_score": <float 0-5>,
  "experience_score": <float 0-5>
}

Scoring guide:
- 5.0 = exceptional, top 1%
- 4.0 = strong, clearly qualified
- 3.0 = decent, meets minimum bar
- 2.0 = weak, significant gaps
- 1.0 = poor fit for this role
- 0.0 = no relevant signal

Even if resume text is missing, score based on college, degree, domain signals, GitHub activity, and experience band.`;
}

/**
 * Detect if an error is a DAILY quota exhaustion (limit: 0) vs a per-minute rate limit.
 * Daily exhaustion means retrying is futile.
 */
function isDailyQuotaExhausted(errorMsg: string): boolean {
  return errorMsg.includes('limit: 0');
}

/**
 * Call Gemini with a single retry on rate limits. If daily quota is exhausted, fail fast.
 */
async function callGemini(prompt: string): Promise<string> {
  for (const modelName of MODEL_PRIORITY) {
    try {
      console.log(`[LLM]   Trying model: ${modelName}`);
      const model = getModel(modelName);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.length > 10) {
        return text;
      }
    } catch (err: any) {
      const msg = err.message || '';
      const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests');

      if (isRateLimit && isDailyQuotaExhausted(msg)) {
        console.log(`[LLM]   ⚠ Daily quota exhausted for ${modelName}. Trying next model...`);
        continue; // Don't retry, try next model
      }

      if (isRateLimit) {
        // Per-minute rate limit: wait once and retry
        const retryMatch = msg.match(/retry in ([\d.]+)s/i);
        const waitSec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 3 : 30;
        console.log(`[LLM]   Rate limited on ${modelName}. Waiting ${waitSec}s then retrying once...`);
        await new Promise(r => setTimeout(r, waitSec * 1000));

        try {
          const model = getModel(modelName);
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text && text.length > 10) return text;
        } catch {
          console.log(`[LLM]   Retry failed for ${modelName}. Trying next model...`);
        }
      } else {
        console.log(`[LLM]   Error on ${modelName}: ${msg.substring(0, 120)}`);
      }
    }
  }

  throw new Error('All Gemini models failed or quota exhausted. Please wait for quota reset or enable billing.');
}

export async function scoreCandidateWithLLM(candidate: any, role: Role) {
  const userPrompt = `${SYSTEM_PROMPT}\n\n${buildUserPrompt(candidate, role)}`;

  try {
    console.log(`[LLM] Scoring: ${candidate.name}`);
    const text = await callGemini(userPrompt);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in LLM response');

    const evaluation = JSON.parse(jsonMatch[0]);

    const scores = {
      llm_profile_summary: evaluation.profile_summary || 'No summary generated.',
      fit_reasoning: evaluation.fit_reasoning || 'No reasoning generated.',
      resume_context_score: Math.min(5, Math.max(0, parseFloat(evaluation.resume_context_score) || 0)),
      github_signal_score: Math.min(5, Math.max(0, parseFloat(evaluation.github_signal_score) || 0)),
      domain_alignment_score: Math.min(5, Math.max(0, parseFloat(evaluation.domain_alignment_score) || 0)),
      experience_score: Math.min(5, Math.max(0, parseFloat(evaluation.experience_score) || 0)),
    };

    console.log(`[LLM] ✓ ${candidate.name}: resume=${scores.resume_context_score}, github=${scores.github_signal_score}, domain=${scores.domain_alignment_score}, exp=${scores.experience_score}`);
    return scores;
  } catch (err: any) {
    console.error(`[LLM] ✗ ${candidate.name}: ${err.message?.substring(0, 150)}`);
    return {
      llm_profile_summary: 'AI scoring could not be completed due to API quota limits. Please re-run the pipeline later or review this candidate manually.',
      fit_reasoning: 'LLM evaluation skipped. Re-run when Gemini API quota resets.',
      resume_context_score: 0,
      github_signal_score: 0,
      domain_alignment_score: 0,
      experience_score: 0,
    };
  }
}

// Track if we've hit a hard quota wall so we can skip remaining candidates
let quotaExhausted = false;

export async function batchScoreCandidates(roleId: string) {
  quotaExhausted = false;

  const { data: role } = await supabase.from('roles').select('*').eq('id', roleId).single();
  if (!role) throw new Error('Role not found');

  const { data: candidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('role_id', roleId);

  if (!candidates || candidates.length === 0) {
    console.log('[LLM] No candidates to score');
    return { scored: 0 };
  }

  console.log(`[LLM] Starting batch scoring for ${candidates.length} candidates against role "${role.title}"`);

  let scored = 0;
  let consecutiveFailures = 0;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];

    // If 3 consecutive candidates failed due to quota, skip the rest
    if (consecutiveFailures >= 3) {
      console.log(`[LLM] ⚠ Skipping remaining ${candidates.length - i} candidates — quota appears exhausted.`);
      // Still save fallback data for skipped candidates
      for (let j = i; j < candidates.length; j++) {
        await supabase.from('candidates').update({
          llm_profile_summary: 'Scoring skipped — Gemini API daily quota exhausted. Re-run tomorrow.',
          fit_reasoning: 'Not evaluated. Please re-run the pipeline when API quota resets.',
          resume_context_score: 0,
          github_signal_score: 0,
          domain_alignment_score: 0,
          experience_score: 0,
        }).eq('id', candidates[j].id);
      }
      break;
    }

    console.log(`[LLM] Processing candidate ${i + 1}/${candidates.length}: ${candidate.name}`);

    const scores = await scoreCandidateWithLLM(candidate, role as Role);

    // Check if scoring actually worked
    const totalSubScores = scores.resume_context_score + scores.github_signal_score + scores.domain_alignment_score + scores.experience_score;
    if (totalSubScores === 0 && scores.llm_profile_summary.includes('quota')) {
      consecutiveFailures++;
    } else {
      consecutiveFailures = 0; // Reset on success
    }

    const { error } = await supabase.from('candidates').update(scores).eq('id', candidate.id);
    if (error) {
      console.error(`[LLM] DB save failed for ${candidate.name}:`, error.message);
    } else {
      scored++;
    }

    // 8-second delay between candidates (free tier: 15 RPM → ~1 every 4s, but be safe)
    if (i < candidates.length - 1 && consecutiveFailures === 0) {
      console.log('[LLM] Waiting 8s before next candidate...');
      await new Promise((r) => setTimeout(r, 8000));
    }
  }

  console.log(`[LLM] Batch scoring complete: ${scored}/${candidates.length} saved`);
  return { scored };
}

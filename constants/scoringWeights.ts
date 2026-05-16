// =============================================================================
// Scoring Weights — Single source of truth for candidate scoring
// =============================================================================
// Total must sum to 1.0. Adjust these to change how candidates are ranked.

export const SCORING_WEIGHTS = {
  resumeContext: 0.40,      // LLM-reasoned resume depth and relevance
  domainAlignment: 0.25,    // Resume + GitHub domain vs role domain match
  githubSignal: 0.20,       // GitHub contribution activity + project quality
  experience: 0.10,         // Years of experience vs role seniority
  collegeTier: 0.05,        // College prestige — tie-breaker only
} as const;

// Runtime validation
const weightSum = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(weightSum - 1.0) > 0.001) {
  throw new Error(`Scoring weights must sum to 1.0, got ${weightSum}`);
}

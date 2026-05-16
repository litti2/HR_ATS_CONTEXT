// =============================================================================
// GitHub Summary Type Definition
// =============================================================================

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  last_pushed: string;
  url: string;
}

export interface GitHubSummary {
  username: string;
  bio: string | null;
  public_repos: number;
  account_age_days: number;
  top_repos: GitHubRepo[];
  languages: { language: string; count: number }[];
  activity_score: number;
  project_quality_score: number;
  active_weeks_90d: number;
  last_push_days_ago: number | null;
  error?: string;
}

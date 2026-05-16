// =============================================================================
// GitHub Profile Scraping Service
// =============================================================================

import { Octokit } from '@octokit/rest';
import { supabase } from '@/utils/supabaseClient';
import { extractGithubUsername } from '@/utils/extractGithubUsername';
import type { GitHubSummary } from '@/types/github';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function scrapeGithub(githubUrl: string): Promise<GitHubSummary> {
  const username = extractGithubUsername(githubUrl);
  if (!username) {
    return { username: '', bio: null, public_repos: 0, account_age_days: 0, top_repos: [], languages: [], activity_score: 0, project_quality_score: 0, active_weeks_90d: 0, last_push_days_ago: null, error: 'invalid_url' };
  }

  try {
    // Fetch user profile
    const { data: user } = await octokit.users.getByUsername({ username });
    const accountAge = Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000);

    // Fetch repos
    const { data: repos } = await octokit.repos.listForUser({ username, per_page: 100, sort: 'updated' });

    // Language distribution
    const langMap: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
    const languages = Object.entries(langMap)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);

    // Top repos by stars
    const topRepos = repos
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        last_pushed: r.pushed_at || '',
        url: r.html_url,
      }));

    // Recent activity (events)
    let activeWeeks = 0;
    let lastPushDaysAgo: number | null = null;
    try {
      const { data: events } = await octokit.activity.listPublicEventsForUser({ username, per_page: 100 });
      const now = Date.now();
      const ninetyDaysAgo = now - 90 * 86400000;
      const weekSet = new Set<number>();

      for (const event of events) {
        const eventTime = new Date(event.created_at || '').getTime();
        if (eventTime > ninetyDaysAgo) {
          const weekNum = Math.floor((now - eventTime) / (7 * 86400000));
          weekSet.add(weekNum);
        }
        if (event.type === 'PushEvent' && lastPushDaysAgo === null) {
          lastPushDaysAgo = Math.floor((now - eventTime) / 86400000);
        }
      }
      activeWeeks = weekSet.size;
    } catch {
      // Events API can fail, degrade gracefully
    }

    // Compute scores
    const activityScore = Math.min(5, (activeWeeks / 12) * 5);
    const maxStars = Math.max(0, ...repos.map((r) => r.stargazers_count || 0));
    const reposWithDesc = repos.filter((r) => r.description && r.description.length > 10).length;
    const projectQualityScore = Math.min(5,
      (Math.min(maxStars, 50) / 50) * 2 +
      (Math.min(reposWithDesc, 20) / 20) * 2 +
      (Math.min(repos.length, 30) / 30) * 1
    );

    return {
      username, bio: user.bio, public_repos: user.public_repos,
      account_age_days: accountAge, top_repos: topRepos, languages,
      activity_score: Math.round(activityScore * 10) / 10,
      project_quality_score: Math.round(projectQualityScore * 10) / 10,
      active_weeks_90d: activeWeeks,
      last_push_days_ago: lastPushDaysAgo,
    };
  } catch (err: any) {
    if (err.status === 404) {
      return { username, bio: null, public_repos: 0, account_age_days: 0, top_repos: [], languages: [], activity_score: 0, project_quality_score: 0, active_weeks_90d: 0, last_push_days_ago: null, error: 'profile_not_found' };
    }
    throw err;
  }
}

export async function scrapeAllGithubProfiles(roleId: string) {
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, github_url')
    .eq('role_id', roleId);

  let scraped = 0, failed = 0, skipped = 0;
  console.log(`[GitHub] Starting scrape for ${(candidates || []).length} candidates`);

  for (const candidate of (candidates || [])) {
    if (!candidate.github_url) {
      console.log(`[GitHub] No GitHub URL for ${candidate.name}, skipping`);
      skipped++;
      continue;
    }

    try {
      console.log(`[GitHub] Scraping: ${candidate.name} (${candidate.github_url})`);
      const summary = await scrapeGithub(candidate.github_url);
      await supabase.from('candidates').update({
        github_summary: summary,
        github_signal_score: summary.error ? 0 : summary.activity_score,
      }).eq('id', candidate.id);
      console.log(`[GitHub] ✓ ${candidate.name}: ${summary.public_repos} repos, activity=${summary.activity_score}`);
      scraped++;
    } catch (err: any) {
      console.error(`[GitHub] ✗ ${candidate.name}: ${err.message || err}`);
      failed++;
    }
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`[GitHub] Complete: ${scraped} scraped, ${failed} failed, ${skipped} skipped`);
  return { scraped, failed };
}

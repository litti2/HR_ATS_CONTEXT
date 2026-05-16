// =============================================================================
// Extract GitHub Username from URL
// =============================================================================
// Handles: https://github.com/username, github.com/username,
//          https://github.com/username/, github.com/username/repo, etc.

export function extractGithubUsername(url: string): string | null {
  if (!url) return null;

  const cleaned = url.trim().replace(/\/+$/, '');

  // Try URL parsing first
  try {
    const parsed = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    if (parsed.hostname === 'github.com' || parsed.hostname === 'www.github.com') {
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length >= 1) {
        return segments[0];
      }
    }
  } catch {
    // Fall through to regex
  }

  // Regex fallback
  const match = cleaned.match(/github\.com\/([a-zA-Z0-9\-_]+)/);
  return match ? match[1] : null;
}

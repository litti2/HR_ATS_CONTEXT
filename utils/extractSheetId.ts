// =============================================================================
// Extract Google Sheet ID from URL or raw ID
// =============================================================================
// Handles: full URL (https://docs.google.com/spreadsheets/d/SHEET_ID/edit)
//          or raw Sheet ID string

export function extractSheetId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If it looks like a URL, extract the ID
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9\-_]+)/);
  if (match) return match[1];

  // If it's already a raw ID (no slashes, reasonable length)
  if (!trimmed.includes('/') && trimmed.length > 10 && trimmed.length < 100) {
    return trimmed;
  }

  return null;
}

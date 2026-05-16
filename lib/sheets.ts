// =============================================================================
// Google Sheets Ingestion Service
// =============================================================================
// Authenticates via Google OAuth, reads candidate rows from the connected
// Google Sheet, downloads resume PDFs from Drive, uploads to Supabase
// Storage, and inserts candidate records into the database.

import { google } from 'googleapis';
import { supabase } from '@/utils/supabaseClient';
import fs from 'fs';
import path from 'path';

function getAuthClient() {
  let credentials: any;
  let token: any;

  // Try environment variables first (Vercel / production)
  if (process.env.GOOGLE_CREDENTIALS && process.env.GOOGLE_TOKEN) {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    token = JSON.parse(process.env.GOOGLE_TOKEN);
  } else {
    // Fall back to local files (development)
    const fs = require('fs');
    const path = require('path');
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    const tokenPath = path.join(process.cwd(), 'token.json');

    if (!fs.existsSync(credentialsPath) || !fs.existsSync(tokenPath)) {
      throw new Error('OAuth credentials missing. Set GOOGLE_CREDENTIALS and GOOGLE_TOKEN env vars, or place credentials.json and token.json in project root.');
    }

    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
  }

  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris ? redirect_uris[0] : 'http://localhost:3001/oauth2callback'
  );

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

export async function fetchCandidatesFromSheet(sheetId: string) {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });

  // Use a wide range to capture all columns — Google Sheets ignores empty trailing cols
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'A:Z',
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('Sheet has no data rows (only header or empty)');
    return [];
  }

  // Log header for debugging
  const header = rows[0];
  console.log(`[Sheets] Header columns (${header.length}):`, header);
  console.log(`[Sheets] Total rows including header: ${rows.length}`);

  // Dynamically map columns by header name (case-insensitive, partial match)
  const colMap: Record<string, number> = {};
  const patterns: Record<string, RegExp> = {
    timestamp: /timestamp/i,
    name: /name/i,
    email: /email/i,
    phone: /phone|mobile|contact/i,
    college: /college|university|institution/i,
    degree: /degree|qualification/i,
    grad_year: /grad|year|graduation/i,
    experience_band: /experience|exp/i,
    linkedin_url: /linkedin/i,
    github_url: /github/i,
    resume_drive_url: /resume|pdf|drive|cv/i,
  };

  for (const [field, pattern] of Object.entries(patterns)) {
    const idx = header.findIndex((h: string) => pattern.test(h));
    if (idx !== -1) {
      colMap[field] = idx;
      console.log(`[Sheets] Mapped "${field}" -> column ${idx} ("${header[idx]}")`);
    } else {
      console.log(`[Sheets] WARNING: Could not find column for "${field}"`);
    }
  }

  // Parse data rows
  const candidates = rows.slice(1).map((row, idx) => ({
    rowIndex: idx + 2,
    timestamp: row[colMap.timestamp] || '',
    name: (row[colMap.name] || '').trim(),
    email: (row[colMap.email] || '').trim(),
    phone: (row[colMap.phone] || '').trim(),
    college: (row[colMap.college] || '').trim(),
    degree: (row[colMap.degree] || '').trim(),
    grad_year: (row[colMap.grad_year] || '').trim(),
    experience_band: (row[colMap.experience_band] || '0-2').trim(),
    linkedin_url: (row[colMap.linkedin_url] || '').trim(),
    github_url: (row[colMap.github_url] || '').trim(),
    resume_drive_url: (row[colMap.resume_drive_url] || '').trim(),
  }));

  // Only filter out rows that have no name at all — email can be empty
  const valid = candidates.filter((c) => c.name);
  console.log(`[Sheets] Parsed ${candidates.length} total rows, ${valid.length} with valid names`);
  
  return valid;
}

export async function downloadAndStorePDF(driveUrl: string, candidateId: string): Promise<string | null> {
  if (!driveUrl) {
    console.log(`[PDF] No drive URL for candidate ${candidateId}, skipping`);
    return null;
  }

  try {
    const auth = getAuthClient();
    const drive = google.drive({ version: 'v3', auth });

    // Extract file ID from various Google Drive URL formats
    let fileId: string | null = null;
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) fileId = openMatch[1];
    
    // Format: https://drive.google.com/file/d/FILE_ID/view
    if (!fileId) {
      const dMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (dMatch) fileId = dMatch[1];
    }
    
    // Format: https://drive.google.com/uc?id=FILE_ID&export=download
    if (!fileId) {
      const ucMatch = driveUrl.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
      if (ucMatch) fileId = ucMatch[1];
    }

    if (!fileId) {
      console.log(`[PDF] Could not extract file ID from URL: ${driveUrl}`);
      return null;
    }

    console.log(`[PDF] Downloading file ${fileId} for candidate ${candidateId}`);
    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data as ArrayBuffer);
    console.log(`[PDF] Downloaded ${buffer.length} bytes`);

    const { error } = await supabase.storage
      .from('resumes')
      .upload(`${candidateId}/resume.pdf`, buffer, { contentType: 'application/pdf', upsert: true });

    if (error) {
      console.error(`[PDF] Supabase upload failed:`, error);
      throw error;
    }

    const { data } = supabase.storage.from('resumes').getPublicUrl(`${candidateId}/resume.pdf`);
    console.log(`[PDF] Stored at: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (err: any) {
    console.error(`[PDF] Download failed for candidate ${candidateId}:`, err.message || err);
    return null;
  }
}

export async function ingestCandidates(sheetId: string, roleId: string) {
  console.log(`[Ingest] Starting ingestion for sheet ${sheetId}, role ${roleId}`);
  const candidates = await fetchCandidatesFromSheet(sheetId);
  console.log(`[Ingest] Fetched ${candidates.length} candidates from sheet`);

  // Deduplicate against existing records
  const { data: existing } = await supabase
    .from('candidates')
    .select('email')
    .eq('role_id', roleId);

  const existingEmails = new Set((existing || []).map((e: { email: string }) => e.email.toLowerCase()));
  const newCandidates = candidates.filter((c) => !existingEmails.has(c.email.toLowerCase()));
  console.log(`[Ingest] ${newCandidates.length} new candidates (${candidates.length - newCandidates.length} already exist)`);

  const inserted = [];
  for (const candidate of newCandidates) {
    const { data, error } = await supabase
      .from('candidates')
      .insert({
        role_id: roleId,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        college: candidate.college,
        degree: candidate.degree,
        grad_year: candidate.grad_year,
        experience_band: candidate.experience_band,
        linkedin_url: candidate.linkedin_url,
        github_url: candidate.github_url,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`[Ingest] Failed to insert candidate ${candidate.name}:`, error.message);
      continue;
    }

    if (data) {
      console.log(`[Ingest] Inserted candidate: ${candidate.name} (${data.id})`);
      // Download and store resume PDF
      if (candidate.resume_drive_url) {
        const pdfUrl = await downloadAndStorePDF(candidate.resume_drive_url, data.id);
        if (pdfUrl) {
          await supabase.from('candidates').update({ resume_pdf_url: pdfUrl }).eq('id', data.id);
        }
      }
      inserted.push(data.id);
    }
  }

  console.log(`[Ingest] Complete: ${inserted.length} ingested, ${candidates.length - newCandidates.length} skipped`);
  return { ingested: inserted.length, skipped: candidates.length - newCandidates.length };
}

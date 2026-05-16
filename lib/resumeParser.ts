// =============================================================================
// Resume PDF Parsing Service
// =============================================================================

import { supabase } from '@/utils/supabaseClient';

export interface ParsedResume {
  raw: string;
  education: string;
  experience: string;
  projects: string;
  skills: string;
}

/**
 * Downloads a PDF from Supabase Storage using the authenticated client
 * (works for private buckets), then parses the text.
 */
export async function parseResume(candidateId: string): Promise<ParsedResume | null> {
  try {
    const storagePath = `${candidateId}/resume.pdf`;
    console.log(`[ResumeParser] Downloading from private bucket: resumes/${storagePath}`);

    // Use the Supabase client to download (works with private buckets)
    const { data, error } = await supabase.storage
      .from('resumes')
      .download(storagePath);

    if (error || !data) {
      console.error(`[ResumeParser] Supabase download failed for ${candidateId}:`, error?.message || 'no data');
      return null;
    }

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[ResumeParser] Downloaded ${buffer.length} bytes`);

    if (buffer.length < 100) {
      console.log('[ResumeParser] File too small, likely not a valid PDF');
      return null;
    }

    // Dynamic import for pdf-parse (server-side only)
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);

    const rawText = pdfData.text || '';
    console.log(`[ResumeParser] Extracted ${rawText.length} characters of text`);

    if (rawText.length < 50) {
      console.log('[ResumeParser] Extracted text too short — possibly image-based PDF');
      return { raw: rawText || 'Unable to extract text from PDF', education: '', experience: '', projects: '', skills: '' };
    }

    return segmentResumeText(rawText);
  } catch (err: any) {
    console.error('[ResumeParser] Parsing failed:', err.message || err);
    return null;
  }
}

function segmentResumeText(rawText: string): ParsedResume {
  const lines = rawText.split('\n');
  const sections: Record<string, string[]> = {
    education: [],
    experience: [],
    projects: [],
    skills: [],
  };

  let currentSection = '';

  const sectionPatterns: Record<string, RegExp> = {
    education: /\b(education|academic|qualification|university|college)\b/i,
    experience: /\b(experience|employment|work\s*history|professional|internship)\b/i,
    projects: /\b(projects|portfolio|personal\s*projects|academic\s*projects)\b/i,
    skills: /\b(skills|technologies|tech\s*stack|proficienc|competenc|tools)\b/i,
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if this line is a section header
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmed) && trimmed.length < 80) {
        currentSection = section;
        break;
      }
    }

    if (currentSection && sections[currentSection]) {
      sections[currentSection].push(trimmed);
    }
  }

  return {
    raw: rawText,
    education: sections.education.join('\n'),
    experience: sections.experience.join('\n'),
    projects: sections.projects.join('\n'),
    skills: sections.skills.join('\n'),
  };
}

export async function parseAllResumes(roleId: string) {
  // Get ALL candidates — we download by candidate ID from storage, not by URL
  const { data: candidates } = await supabase
    .from('candidates')
    .select('id, name, resume_pdf_url')
    .eq('role_id', roleId);

  let parsed = 0;
  let failed = 0;
  let skipped = 0;

  for (const candidate of (candidates || [])) {
    if (!candidate.resume_pdf_url) {
      console.log(`[ResumeParser] No PDF uploaded for ${candidate.name}, skipping`);
      skipped++;
      continue;
    }

    // Use candidate ID to download from private bucket
    const result = await parseResume(candidate.id);
    if (result) {
      await supabase.from('candidates').update({ resume_text: result.raw }).eq('id', candidate.id);
      console.log(`[ResumeParser] ✓ Parsed resume for ${candidate.name} (${result.raw.length} chars)`);
      parsed++;
    } else {
      console.log(`[ResumeParser] ✗ Failed to parse resume for ${candidate.name}`);
      failed++;
    }
  }

  console.log(`[ResumeParser] Complete: ${parsed} parsed, ${failed} failed, ${skipped} skipped (no PDF)`);
  return { parsed, failed };
}

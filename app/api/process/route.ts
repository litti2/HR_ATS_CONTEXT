// =============================================================================
// Process Pipeline API Route — Orchestrates the full pipeline
// =============================================================================

// Vercel serverless function config: allow up to 300s (Pro plan)
export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { ingestCandidates } from '@/lib/sheets';
import { parseAllResumes } from '@/lib/resumeParser';
import { scrapeAllGithubProfiles } from '@/lib/githubScraper';
import { classifyAllDomains } from '@/lib/domainClassifier';
import { scoreAllColleges } from '@/lib/collegeRanker';
import { batchScoreCandidates } from '@/lib/llmScorer';
import { rankCandidates } from '@/lib/ranker';

async function logStage(roleId: string, stage: string, status: string, message: string) {
  try {
    await supabase.from('processing_logs').insert({
      role_id: roleId,
      stage,
      status,
      message,
    });
  } catch (err) {
    console.error(`Failed to log stage ${stage}:`, err);
  }
}

export async function POST(request: NextRequest) {
  let roleId = '';
  
  try {
    const body = await request.json();
    roleId = body.roleId;

    // Get role config
    const { data: role, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (error || !role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Update role status
    await supabase.from('roles').update({ status: 'processing' }).eq('id', roleId);

    // Stage 1: Ingest from Google Sheets
    await logStage(roleId, 'INGESTING', 'running', 'Ingesting candidates from Google Sheets...');
    try {
      const ingestResult = await ingestCandidates(role.google_sheet_id, roleId);
      await logStage(roleId, 'INGESTING', 'complete', `Ingested ${ingestResult.ingested} new candidates (${ingestResult.skipped} skipped as duplicates)`);
    } catch (err: any) {
      console.error('INGESTING failed:', err);
      await logStage(roleId, 'INGESTING', 'complete', `Ingestion error: ${err.message}. Continuing with existing candidates...`);
    }

    // Stage 2: Parse Resumes
    await logStage(roleId, 'PARSING', 'running', 'Parsing resume PDFs...');
    try {
      const parseResult = await parseAllResumes(roleId);
      await logStage(roleId, 'PARSING', 'complete', `Parsed ${parseResult.parsed} resumes, ${parseResult.failed} failed`);
    } catch (err: any) {
      console.error('PARSING failed:', err);
      await logStage(roleId, 'PARSING', 'complete', `Resume parsing error: ${err.message}. Continuing...`);
    }

    // Stage 3: Scrape GitHub
    await logStage(roleId, 'SCRAPING', 'running', 'Scraping GitHub profiles...');
    try {
      const scrapeResult = await scrapeAllGithubProfiles(roleId);
      await logStage(roleId, 'SCRAPING', 'complete', `Scraped ${scrapeResult.scraped} profiles, ${scrapeResult.failed} failed`);
    } catch (err: any) {
      console.error('SCRAPING failed:', err);
      await logStage(roleId, 'SCRAPING', 'complete', `GitHub scraping error: ${err.message}. Continuing...`);
    }

    // Stage 4: Classify Domains
    await logStage(roleId, 'CLASSIFYING', 'running', 'Classifying domain signals...');
    try {
      const classifyResult = await classifyAllDomains(roleId);
      await logStage(roleId, 'CLASSIFYING', 'complete', `Classified ${classifyResult.classified} candidates`);
    } catch (err: any) {
      console.error('CLASSIFYING failed:', err);
      await logStage(roleId, 'CLASSIFYING', 'complete', `Classification error: ${err.message}. Continuing...`);
    }

    // Stage 5: Score Colleges
    await logStage(roleId, 'SCORING', 'running', 'Scoring college tiers...');
    try {
      const collegeResult = await scoreAllColleges(roleId);
      await logStage(roleId, 'SCORING', 'complete', `College scored ${collegeResult.scored} candidates`);
    } catch (err: any) {
      console.error('College SCORING failed:', err);
      await logStage(roleId, 'SCORING', 'complete', `College scoring error: ${err.message}. Continuing...`);
    }

    // Stage 6: LLM Score (the big one - Gemini evaluates each candidate)
    await logStage(roleId, 'SCORING', 'running', 'LLM scoring candidates with Gemini...');
    try {
      const llmResult = await batchScoreCandidates(roleId);
      await logStage(roleId, 'SCORING', 'complete', `LLM scored ${llmResult.scored} candidates`);
    } catch (err: any) {
      console.error('LLM SCORING failed:', err);
      await logStage(roleId, 'SCORING', 'complete', `LLM scoring error: ${err.message}. Continuing with available scores...`);
    }

    // Stage 7: Rank
    await logStage(roleId, 'RANKING', 'running', 'Ranking and shortlisting...');
    try {
      const rankResult = await rankCandidates(roleId);
      await logStage(roleId, 'RANKING', 'complete', `Ranked ${rankResult.ranked}, shortlisted ${rankResult.shortlisted}`);
    } catch (err: any) {
      console.error('RANKING failed:', err);
      await logStage(roleId, 'RANKING', 'complete', `Ranking error: ${err.message}`);
    }

    // Done
    await logStage(roleId, 'DONE', 'complete', 'Processing complete!');
    await supabase.from('roles').update({ status: 'done' }).eq('id', roleId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Pipeline error:', error);
    if (roleId) {
      await logStage(roleId, 'DONE', 'error', `Pipeline failed: ${error.message}`);
      await supabase.from('roles').update({ status: 'error' }).eq('id', roleId);
    }
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

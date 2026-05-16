// =============================================================================
// Processing Log Type Definition
// =============================================================================

export type PipelineStage =
  | 'INGESTING'
  | 'PARSING'
  | 'SCRAPING'
  | 'CLASSIFYING'
  | 'SCORING'
  | 'RANKING'
  | 'DONE';

export type StageStatus = 'running' | 'complete' | 'error';

export interface ProcessingLog {
  id: string;
  role_id: string;
  stage: PipelineStage;
  status: StageStatus;
  message: string;
  timestamp: string;
}

export const PIPELINE_STAGES: { stage: PipelineStage; label: string }[] = [
  { stage: 'INGESTING', label: 'Ingesting candidates from Google Sheets' },
  { stage: 'PARSING', label: 'Parsing resume PDFs' },
  { stage: 'SCRAPING', label: 'Scraping GitHub profiles' },
  { stage: 'CLASSIFYING', label: 'Classifying domain signals' },
  { stage: 'SCORING', label: 'LLM scoring candidates' },
  { stage: 'RANKING', label: 'Ranking and shortlisting' },
  { stage: 'DONE', label: 'Processing complete' },
];

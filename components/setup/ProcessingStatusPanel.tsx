'use client';

import { useEffect, useState, useCallback } from 'react';
import { PIPELINE_STAGES, type PipelineStage, type StageStatus } from '@/types/processing';
import { CheckCircle2, Loader2, XCircle, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface StageState {
  stage: PipelineStage;
  status: StageStatus | 'pending';
  message: string;
}

interface ProcessingStatusPanelProps {
  roleId: string;
}

export default function ProcessingStatusPanel({ roleId }: ProcessingStatusPanelProps) {
  const [stages, setStages] = useState<StageState[]>(
    PIPELINE_STAGES.map((s) => ({
      stage: s.stage,
      status: 'pending' as const,
      message: s.label,
    }))
  );
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Poll the processing_logs table for real status
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/processing-status?roleId=${roleId}`);
      if (!res.ok) return;
      const data = await res.json();

      if (data.status === 'done') {
        setIsDone(true);
        setStages(prev => prev.map(s => ({ ...s, status: 'complete' as StageStatus })));
        return true; // stop polling
      }

      if (data.status === 'error') {
        setHasError(true);
        setErrorMessage(data.errorMessage || 'An error occurred during processing.');
        return true; // stop polling
      }

      // Update stages based on logs
      if (data.logs && data.logs.length > 0) {
        setStages(prev => {
          const updated = [...prev];
          // Map log stages to our pipeline stages
          const stageMap: Record<string, number> = {
            'INGESTING': 0,
            'PARSING': 1,
            'SCRAPING': 2,
            'CLASSIFYING': 3,
            'SCORING': 4, // covers both college scoring and LLM scoring
            'RANKING': 5,
            'DONE': 6,
          };

          // Find the latest completed and running stages
          let lastCompletedIdx = -1;
          let currentRunningStage = '';

          for (const log of data.logs) {
            const idx = stageMap[log.stage];
            if (idx !== undefined) {
              if (log.status === 'complete') {
                lastCompletedIdx = Math.max(lastCompletedIdx, idx);
              }
              if (log.status === 'running') {
                currentRunningStage = log.stage;
              }
            }
          }

          // Update each stage
          for (let i = 0; i < updated.length; i++) {
            if (i <= lastCompletedIdx) {
              updated[i] = { ...updated[i], status: 'complete' as StageStatus };
            } else if (i === lastCompletedIdx + 1) {
              updated[i] = { ...updated[i], status: 'running' as StageStatus };
            } else {
              updated[i] = { ...updated[i], status: 'pending' };
            }
          }

          // Update messages from latest logs
          for (const log of data.logs) {
            const idx = stageMap[log.stage];
            if (idx !== undefined && idx < updated.length && log.message) {
              updated[idx] = { ...updated[idx], message: log.message };
            }
          }

          return updated;
        });
      }

      return false; // continue polling
    } catch (err) {
      console.error('Failed to poll processing status:', err);
      return false;
    }
  }, [roleId]);

  useEffect(() => {
    // Poll every 3 seconds
    const poll = async () => {
      const shouldStop = await pollStatus();
      if (!shouldStop) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    poll();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pollStatus]);

  const completedCount = stages.filter(s => s.status === 'complete').length;
  const progress = (completedCount / stages.length) * 100;

  const getIcon = (status: StageStatus | 'pending') => {
    switch (status) {
      case 'complete': return <CheckCircle2 size={16} className="text-teal-dim" strokeWidth={2} />;
      case 'running': return <Loader2 size={16} className="text-primary-dim animate-spin" />;
      case 'error': return <XCircle size={16} className="text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-[rgba(255,255,255,0.08)]" />;
    }
  };

  return (
    <div className="glass-card-static overflow-hidden">
      {/* Progress bar */}
      <div className="h-0.5 bg-[rgba(255,255,255,0.04)]">
        <div
          className="h-full bg-gradient-to-r from-primary-vivid to-teal-vivid transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-display font-semibold text-on-surface flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-vivid/10 border border-primary-vivid/15 flex items-center justify-center">
              <Zap size={14} className="text-primary-dim" strokeWidth={2} />
            </div>
            Pipeline Status
          </h2>
          <span className="text-xs font-mono text-[#52525b]">
            {completedCount}/{stages.length} stages
          </span>
        </div>

        {/* Stages */}
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.stage}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-400 ${
                stage.status === 'running'
                  ? 'bg-primary-vivid/[0.06] border border-primary-vivid/15'
                  : stage.status === 'complete'
                  ? 'bg-teal-vivid/[0.03]'
                  : 'bg-[rgba(255,255,255,0.015)]'
              }`}
            >
              {getIcon(stage.status)}
              <span className={`text-sm flex-1 transition-colors ${
                stage.status === 'pending' ? 'text-[#52525b]' :
                stage.status === 'running' ? 'text-on-surface' :
                'text-[#a1a1aa]'
              }`}>
                {stage.message}
              </span>
              {stage.status === 'running' && (
                <span className="text-[10px] text-primary-dim/60 font-mono tracking-wide">
                  processing...
                </span>
              )}
              {stage.status === 'complete' && (
                <span className="text-[10px] text-teal-dim/50 font-mono">
                  done
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Error State */}
        {hasError && (
          <div className="mt-6 p-5 rounded-2xl bg-red-500/[0.06] border border-red-500/15">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400 mb-1">Processing Error</p>
                <p className="text-xs text-[#a1a1aa] font-mono">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Completion CTA */}
        {isDone && (
          <div className="mt-6 p-5 rounded-2xl bg-teal-vivid/[0.06] border border-teal-vivid/15">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-dim flex items-center gap-2">
                  <CheckCircle2 size={15} strokeWidth={2} />
                  Processing complete
                </p>
                <p className="text-xs text-[#a1a1aa] mt-1 font-mono">Your shortlist is ready to review</p>
              </div>
              <Link href={`/results?roleId=${roleId}`} className="btn-primary text-sm px-5 py-2.5 group">
                View Shortlist
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

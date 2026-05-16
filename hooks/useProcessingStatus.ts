// =============================================================================
// useProcessingStatus — Polls /api/status every 5s during pipeline run
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { ProcessingLog, PipelineStage, StageStatus } from '@/types/processing';

interface ProcessingStatus {
  currentStage: PipelineStage | null;
  currentStatus: StageStatus | null;
  message: string | null;
  logs: ProcessingLog[];
  isComplete: boolean;
  isError: boolean;
}

export function useProcessingStatus(roleId: string | null, enabled: boolean = true) {
  const [status, setStatus] = useState<ProcessingStatus>({
    currentStage: null,
    currentStatus: null,
    message: null,
    logs: [],
    isComplete: false,
    isError: false,
  });

  const fetchStatus = useCallback(async () => {
    if (!roleId) return;

    try {
      const res = await fetch(`/api/status?roleId=${roleId}`);
      const data = await res.json();

      setStatus({
        currentStage: data.currentStage,
        currentStatus: data.currentStatus,
        message: data.message,
        logs: data.logs || [],
        isComplete: data.currentStage === 'DONE',
        isError: data.currentStatus === 'error',
      });
    } catch (err) {
      console.error('Status poll failed:', err);
    }
  }, [roleId]);

  useEffect(() => {
    if (!enabled || !roleId) return;

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [enabled, roleId, fetchStatus]);

  return status;
}

// =============================================================================
// useCandidates — Fetches and manages shortlisted candidates
// =============================================================================

import { useState, useEffect } from 'react';
import type { Candidate } from '@/types/candidate';

export function useCandidates(roleId: string | null) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleId) return;

    async function fetchCandidates() {
      setLoading(true);
      try {
        const res = await fetch(`/api/candidates?roleId=${roleId}`);
        const data = await res.json();
        setCandidates(data.candidates || []);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, [roleId]);

  return { candidates, loading, error };
}

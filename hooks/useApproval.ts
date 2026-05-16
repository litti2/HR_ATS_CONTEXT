// =============================================================================
// useApproval — Manages candidate email approval toggle state
// =============================================================================

import { useState, useCallback } from 'react';

export function useApproval() {
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const toggleApproval = useCallback((id: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const approveAll = useCallback((ids: string[]) => {
    setApprovedIds(new Set(ids));
  }, []);

  const clearAll = useCallback(() => {
    setApprovedIds(new Set());
  }, []);

  const submitApprovals = useCallback(async (roleId: string) => {
    const ids = Array.from(approvedIds);
    if (ids.length === 0) return { sent: 0, failed: 0 };

    // First approve
    await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateIds: ids, approved: true }),
    });

    // Then trigger email send
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId }),
    });

    return await res.json();
  }, [approvedIds]);

  return {
    approvedIds,
    approvedCount: approvedIds.size,
    toggleApproval,
    approveAll,
    clearAll,
    submitApprovals,
  };
}

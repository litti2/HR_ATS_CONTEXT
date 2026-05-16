'use client';

import { useState } from 'react';
import type { Candidate } from '@/types/candidate';
import CandidateCard from './CandidateCard';
import CandidateOverlay from './CandidateOverlay';
import EmptyState from '../shared/EmptyState';
import { Users } from 'lucide-react';

interface CandidateGridProps {
  candidates: Candidate[];
  approvedIds: Set<string>;
  onToggleApproval: (id: string) => void;
}

export default function CandidateGrid({
  candidates,
  approvedIds,
  onToggleApproval,
}: CandidateGridProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  if (candidates.length === 0) {
    return (
      <EmptyState
        title="No candidates found"
        description="Try adjusting your filters to see more results."
        icon={<Users size={32} className="text-[#52525b]" strokeWidth={1.5} />}
      />
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 relative z-10">
        {candidates.map((candidate, i) => (
          <div
            key={candidate.id}
            className="animate-fade-up opacity-0"
            style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
          >
            <CandidateCard
              candidate={candidate}
              isApproved={approvedIds.has(candidate.id)}
              onToggleApproval={onToggleApproval}
              onViewProfile={setSelectedCandidate}
            />
          </div>
        ))}
      </div>

      <CandidateOverlay
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        isApproved={selectedCandidate ? approvedIds.has(selectedCandidate.id) : false}
        onToggleApproval={onToggleApproval}
      />
    </>
  );
}

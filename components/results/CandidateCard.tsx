'use client';

import { DOMAIN_COLORS, type DomainType } from '@/constants/domainSignals';
import type { Candidate } from '@/types/candidate';
import { Trophy, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import StarRating from '../shared/StarRating';
import Badge from '../shared/Badge';

interface CandidateCardProps {
  candidate: Candidate;
  isApproved: boolean;
  onToggleApproval: (id: string) => void;
  onViewProfile: (candidate: Candidate) => void;
}

export default function CandidateCard({
  candidate,
  isApproved,
  onToggleApproval,
  onViewProfile,
}: CandidateCardProps) {
  const primaryDomain = candidate.primary_domain as DomainType | null;
  const domainColor = primaryDomain ? DOMAIN_COLORS[primaryDomain] : 'pill';
  
  // Parse numeric score from total_score if available
  const score = candidate.total_score ? candidate.total_score : 0;
  // Use a 5-point scale rating for visual representation (approximate)
  const starScore = Math.min((score / 100) * 5, 5);

  return (
    <div
      className={`glass-card p-6 flex flex-col h-full cursor-pointer group ${
        isApproved ? 'border-primary-vivid/40 bg-[rgba(108,62,240,0.03)]' : ''
      }`}
      onClick={() => onToggleApproval(candidate.id)}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex gap-2">
          {candidate.rank && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-sm ${
              candidate.rank <= 3
                ? 'bg-gradient-to-br from-primary-vivid to-teal-vivid text-white shadow-glow-sm'
                : 'bg-[rgba(255,255,255,0.06)] text-on-surface'
            }`}>
              #{candidate.rank}
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-lg text-on-surface leading-none mb-1">
              {candidate.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#a1a1aa]">
              <GraduationCap size={12} />
              <span className="truncate max-w-[150px]">{candidate.college}</span>
              <span className="text-[10px] text-[#52525b] mx-0.5">•</span>
              <span>{candidate.experience_band}</span>
            </div>
          </div>
        </div>

        {/* Approval Checkbox */}
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            isApproved
              ? 'bg-primary-vivid border-primary-vivid'
              : 'border-[rgba(255,255,255,0.2)] group-hover:border-[rgba(255,255,255,0.4)]'
          }`}
        >
          {isApproved && (
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Domain Signals */}
      <div className="flex flex-wrap gap-1.5 mb-5 relative z-10">
        {(candidate.domain_signals || []).slice(0, 3).map((sig) => (
          <Badge key={sig} variant={primaryDomain ? (DOMAIN_COLORS[primaryDomain]?.replace('pill-', '') as any) : 'default'} size="sm">
            {sig}
          </Badge>
        ))}
        {(candidate.domain_signals || []).length > 3 && (
          <Badge variant="default" size="sm">+{(candidate.domain_signals || []).length - 3}</Badge>
        )}
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-1" />

      {/* Footer / Metrics */}
      <div className="pt-4 mt-auto border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="text-[10px] text-[#52525b] font-mono tracking-wider uppercase">AI Score</div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold text-teal-dim">{score.toFixed(1)}</span>
            <span className="text-[10px] text-[#52525b] font-mono">/100</span>
            <StarRating score={starScore} showNumeric={false} size={13} />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(candidate);
          }}
          className="p-2 rounded-xl text-[#a1a1aa] hover:text-on-surface hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer group/btn"
        >
          <ArrowRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      {/* Background Hover Refraction */}
      <div className="absolute inset-0 rounded-3xl bg-card-sheen opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}

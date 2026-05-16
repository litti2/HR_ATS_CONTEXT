'use client';

import { useEffect } from 'react';
import type { Candidate } from '@/types/candidate';
import { X, ExternalLink, Mail, Phone, Github, Linkedin, Calendar, GitCommit, FileText, Bot, Plus, Minus } from 'lucide-react';
import Badge from '../shared/Badge';
import StarRating from '../shared/StarRating';
import ScoreBreakdown from './ScoreBreakdown';
import { DOMAIN_COLORS, type DomainType } from '@/constants/domainSignals';

interface CandidateOverlayProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  isApproved: boolean;
  onToggleApproval: (id: string) => void;
}

export default function CandidateOverlay({
  candidate, isOpen, onClose, isApproved, onToggleApproval,
}: CandidateOverlayProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !candidate) return null;

  const score = candidate.total_score ?? 0;
  const starScore = Math.min((score / 100) * 5, 5);
  const primaryDomain = candidate.primary_domain as DomainType | null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="glass-card-static relative z-10 w-full max-w-2xl h-full flex flex-col rounded-none rounded-l-3xl border-r-0 animate-slide-in-right overflow-hidden bg-surface">
        
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-[rgba(255,255,255,0.06)] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-vivid/10 blur-[80px] rounded-full pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-[#a1a1aa] hover:text-on-surface hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer z-10"
          >
            <X size={20} />
          </button>

          <div className="flex items-start gap-4">
            {candidate.rank && (
              <div className="mt-1 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-vivid to-teal-vivid text-white shadow-glow-sm flex items-center justify-center font-display font-bold text-xl relative z-10">
                #{candidate.rank}
              </div>
            )}
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl text-on-surface mb-2">{candidate.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#a1a1aa] mb-3">
                <span>{candidate.college}</span>
                <span className="text-[#52525b]">•</span>
                <span>{candidate.degree} '{candidate.grad_year}</span>
                <span className="text-[#52525b]">•</span>
                <span>{candidate.experience_band}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold text-teal-dim">{score.toFixed(1)}</span>
                <span className="text-xs text-[#52525b] font-mono">/100</span>
                <StarRating score={starScore} size={16} showNumeric={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Quick Actions & Contact (Masked) */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-sm text-[#a1a1aa] font-mono">
              <Mail size={14} className="text-[#52525b]" />
              {candidate.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-sm text-[#a1a1aa] font-mono">
              <Phone size={14} className="text-[#52525b]" />
              {candidate.phone || 'N/A'}
            </div>
            {candidate.linkedin_url && (
              <a href={candidate.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(10,102,194,0.1)] border border-[rgba(10,102,194,0.2)] text-[#b4c5ff] hover:bg-[rgba(10,102,194,0.15)] transition-colors text-sm font-medium">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {candidate.github_url && (
              <a href={candidate.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-on-surface hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm font-medium">
                <Github size={14} /> GitHub
              </a>
            )}
            {candidate.resume_pdf_url && (
              <a href={candidate.resume_pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-on-surface hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm font-medium">
                <FileText size={14} /> Resume PDF <ExternalLink size={12} className="ml-1 opacity-50" />
              </a>
            )}
          </div>

          {/* AI Insights */}
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-mono font-medium text-primary-dim uppercase tracking-wider mb-3">
                <Bot size={16} /> AI Profile Summary
              </h3>
              <div className="p-5 rounded-2xl bg-primary-vivid/[0.03] border border-primary-vivid/10 text-sm text-on-surface leading-relaxed">
                {candidate.llm_profile_summary || 'No summary available.'}
              </div>
            </div>
            
            <div>
              <h3 className="flex items-center gap-2 text-sm font-mono font-medium text-teal-dim uppercase tracking-wider mb-3">
                <Bot size={16} /> Fit Reasoning
              </h3>
              <div className="p-5 rounded-2xl bg-teal-vivid/[0.03] border border-teal-vivid/10 text-sm text-on-surface leading-relaxed">
                {candidate.fit_reasoning || 'No reasoning available.'}
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />

          {/* GitHub Intelligence */}
          {candidate.github_summary && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-display font-semibold text-on-surface mb-4">
                <Github size={18} /> GitHub Intelligence
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-center">
                  <div className="text-2xl font-mono font-bold text-on-surface mb-1">{candidate.github_summary.public_repos ?? 0}</div>
                  <div className="text-[10px] text-[#a1a1aa] font-mono uppercase">Total Repos</div>
                </div>
                <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-center">
                  <div className="text-2xl font-mono font-bold text-on-surface mb-1">{candidate.github_summary.active_weeks_90d ?? 0}</div>
                  <div className="text-[10px] text-[#a1a1aa] font-mono uppercase">Active Weeks</div>
                </div>
                <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-center">
                  <div className="text-2xl font-mono font-bold text-on-surface mb-1 flex items-center justify-center gap-1">
                    <GitCommit size={16} className="text-[#52525b]" />
                    {candidate.github_summary.top_repos?.length ?? 0}
                  </div>
                  <div className="text-[10px] text-[#a1a1aa] font-mono uppercase">Top Repos</div>
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs text-[#52525b] font-mono mb-2">Top Languages</div>
                <div className="flex flex-wrap gap-2">
                  {(candidate.github_summary.languages || []).map((lang: any) => (
                    <Badge key={typeof lang === 'string' ? lang : lang.language} size="sm" variant="blue">{typeof lang === 'string' ? lang : lang.language}</Badge>
                  ))}
                </div>
              </div>
              
              {(candidate.github_summary.top_repos || []).length > 0 && (
                <div>
                  <div className="text-xs text-[#52525b] font-mono mb-2">Notable Repositories</div>
                  <ul className="space-y-2">
                    {(candidate.github_summary.top_repos || []).map((repo: any) => (
                      <li key={typeof repo === 'string' ? repo : repo.name} className="text-sm text-on-surface bg-[rgba(255,255,255,0.02)] rounded-lg px-3 py-2 font-mono flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#52525b]">
                        {typeof repo === 'string' ? repo : `${repo.name}${repo.stars ? ` ⭐${repo.stars}` : ''}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />

          {/* Scoring Deep Dive */}
          <div>
            <h3 className="text-base font-display font-semibold text-on-surface mb-5">Score Breakdown</h3>
            <ScoreBreakdown 
              resumeContext={candidate.resume_context_score}
              domainAlignment={candidate.domain_alignment_score}
              githubSignal={candidate.github_signal_score}
              experience={candidate.experience_score}
              collegeTier={candidate.college_tier_score}
            />
          </div>

          <div className="h-10" /> {/* Bottom spacer */}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.06)] bg-surface shrink-0 flex items-center justify-between">
          <div className="text-sm text-[#a1a1aa]">
            Would you like to shortlist this candidate?
          </div>
          <button
            onClick={() => onToggleApproval(candidate.id)}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 ${
              isApproved 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                : 'btn-primary'
            }`}
          >
            {isApproved ? (
              <><Minus size={16} /> Exclude Candidate</>
            ) : (
              <><Plus size={16} /> Include Candidate</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

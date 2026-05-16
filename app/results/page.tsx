'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CandidateGrid from '@/components/results/CandidateGrid';
import FilterBar from '@/components/results/FilterBar';
import SortControls from '@/components/results/SortControls';
import ApproveEmailButton from '@/components/results/ApproveEmailButton';
import ConfirmModal from '@/components/shared/ConfirmModal';
import ProcessingStatusPanel from '@/components/setup/ProcessingStatusPanel';
import { Users, Trophy, Sparkles, Loader2 } from 'lucide-react';
import { Candidate } from '@/types/candidate';

function ResultsContent() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get('roleId');

  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [scoreFilter, setScoreFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);
  const [roleStatus, setRoleStatus] = useState<string>('active');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!roleId) return;
    
    async function fetchCandidates() {
      try {
        const res = await fetch(`/api/candidates?roleId=${roleId}`);
        const data = await res.json();
        setAllCandidates(data.candidates || []);
        if (data.roleStatus) {
          setRoleStatus(data.roleStatus);
        }
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCandidates();
    
    // Poll every 5 seconds if still processing
    const interval = setInterval(() => {
      if (roleStatus === 'processing') {
        fetchCandidates();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [roleId, roleStatus]);

  // Filter
  const filtered = useMemo(() => {
    return allCandidates.filter((c) => {
      if (scoreFilter !== 'all') {
        const minScore = parseFloat(scoreFilter);
        if ((c.total_score ?? 0) < minScore) return false;
      }
      if (domainFilter !== 'all' && c.primary_domain !== domainFilter) return false;
      if (experienceFilter !== 'all' && c.experience_band !== experienceFilter) return false;
      return true;
    });
  }, [allCandidates, scoreFilter, domainFilter, experienceFilter]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case 'experience':
        return copy.sort((a, b) => {
          const expOrder: Record<string, number> = { '4+': 3, '2-4': 2, '0-2': 1 };
          return (expOrder[b.experience_band || ''] || 0) - (expOrder[a.experience_band || ''] || 0);
        });
      case 'github':
        return copy.sort((a, b) => (b.github_signal_score ?? 0) - (a.github_signal_score ?? 0));
      default:
        return copy.sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0));
    }
  }, [filtered, sortBy]);

  const toggleApproval = (id: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendEmails = async () => {
    if (!roleId) return;
    setShowConfirm(false);
    setIsSending(true);
    
    try {
      // 1. Approve selected candidates
      await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateIds: Array.from(approvedIds), approved: true }),
      });
      
      // 2. Dispatch emails
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      });

      // Refresh candidates to show 'Emailed' status
      const res = await fetch(`/api/candidates?roleId=${roleId}`);
      const data = await res.json();
      setAllCandidates(data.candidates || []);

    } catch (err) {
      console.error('Failed to send emails:', err);
    } finally {
      setIsSending(false);
      setApprovedIds(new Set());
    }
  };

  // Stats
  const totalProcessed = allCandidates.length;
  const avgScore = totalProcessed > 0 ? allCandidates.reduce((s, c) => s + (c.total_score ?? 0), 0) / totalProcessed : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#a1a1aa]">
          <Loader2 className="animate-spin text-teal-dim" size={32} />
          <p>Loading your candidates...</p>
        </div>
      </div>
    );
  }

  // Show processing panel if currently processing and no shortlisted candidates are ready
  // Actually, even if there are some candidates, we could show the panel, but let's replace the whole screen
  if (roleStatus === 'processing' && roleId) {
    return (
      <div className="min-h-screen py-12 sm:py-16 flex justify-center items-center">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-on-surface mb-2">Analyzing Candidates</h1>
            <p className="text-[#a1a1aa]">Please wait while Antigravity processes the submissions...</p>
          </div>
          {/* We would import ProcessingStatusPanel here. I'll need to add the import at the top of the file! */}
          <ProcessingStatusPanel roleId={roleId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 relative">
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-teal-vivid/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Header & Stats Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] mb-5">
              <Sparkles size={12} className="text-teal-dim" />
              <span className="text-[11px] font-mono font-medium text-[#a1a1aa] tracking-wide">Review & Dispatch</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-3 tracking-tight">
              Shortlisted Candidates
            </h1>
            <p className="text-[#a1a1aa] text-base max-w-xl leading-relaxed">
              Review the top tier of talent ranked by AI intelligence. Select candidates to approve for assignment dispatch.
            </p>
          </div>

          <div className="flex gap-4 shrink-0">
            <div className="glass-card-static px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-vivid/10 border border-primary-vivid/15 flex items-center justify-center">
                <Users size={18} className="text-primary-dim" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-on-surface leading-none mb-1">{totalProcessed}</div>
                <div className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Processed</div>
              </div>
            </div>

            <div className="glass-card-static px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-vivid/10 border border-teal-vivid/15 flex items-center justify-center">
                <Trophy size={18} className="text-teal-dim" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-on-surface leading-none mb-1">{sorted.length}</div>
                <div className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Shortlisted</div>
              </div>
            </div>
            
            <div className="glass-card-static px-6 py-4 flex items-center gap-4 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-sky/10 border border-sky/15 flex items-center justify-center">
                <Sparkles size={18} className="text-sky" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-mono font-bold text-on-surface leading-none mb-1">{avgScore.toFixed(1)}</div>
                <div className="text-[10px] font-mono text-[#a1a1aa] uppercase tracking-wider">Avg Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Sort Toolbar */}
        <div className="glass-card-static p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <FilterBar
            scoreFilter={scoreFilter}
            domainFilter={domainFilter}
            experienceFilter={experienceFilter}
            onScoreChange={setScoreFilter}
            onDomainChange={setDomainFilter}
            onExperienceChange={setExperienceFilter}
          />
          <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />
          <SortControls sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {/* Candidate Grid */}
        <CandidateGrid
          candidates={sorted}
          approvedIds={approvedIds}
          onToggleApproval={toggleApproval}
        />

        {approvedIds.size > 0 && <div className="h-32" />}
      </div>

      <ApproveEmailButton
        approvedCount={approvedIds.size}
        onApproveAndSend={() => setShowConfirm(true)}
        isSending={isSending}
      />

      <ConfirmModal
        isOpen={showConfirm}
        title="Send Assignment Emails"
        message={`You are about to send personalized assignment emails to ${approvedIds.size} candidate${approvedIds.size !== 1 ? 's' : ''}. This action cannot be undone. Continue?`}
        confirmLabel="Send Emails"
        variant="primary"
        onConfirm={handleSendEmails}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-teal-dim" size={32} /></div>}>
      <ResultsContent />
    </Suspense>
  );
}

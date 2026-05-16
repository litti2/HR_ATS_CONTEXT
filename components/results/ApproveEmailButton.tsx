'use client';

import { Mail, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ApproveEmailButtonProps {
  approvedCount: number;
  onApproveAndSend: () => void;
  isSending: boolean;
}

export default function ApproveEmailButton({
  approvedCount, onApproveAndSend, isSending,
}: ApproveEmailButtonProps) {
  if (approvedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-5 sm:p-6 bg-gradient-to-t from-obsidian via-obsidian/95 to-transparent pointer-events-none animate-slide-up">
      <div className="max-w-2xl mx-auto flex items-center justify-between glass-card-static p-4 pl-6 pointer-events-auto shadow-card-hover border-primary-vivid/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-vivid/20 flex items-center justify-center border border-primary-vivid/30">
            <CheckCircle2 size={16} className="text-primary-light" />
          </div>
          <div>
            <span className="font-display font-bold text-on-surface">
              {approvedCount} candidate{approvedCount !== 1 ? 's' : ''} selected
            </span>
            <p className="text-xs text-[#a1a1aa] font-mono mt-0.5">Ready for assignment dispatch</p>
          </div>
        </div>

        <button
          onClick={onApproveAndSend}
          disabled={isSending}
          className="btn-primary text-sm px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? <LoadingSpinner size="sm" /> : <Mail size={16} strokeWidth={2} />}
          {isSending ? 'Sending...' : 'Approve & Send Emails'}
        </button>
      </div>
    </div>
  );
}

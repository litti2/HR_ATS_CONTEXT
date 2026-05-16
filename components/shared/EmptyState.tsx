'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 rounded-3xl bg-[rgba(255,255,255,0.03)] p-6 border border-[rgba(255,255,255,0.06)]">
        {icon || <Inbox size={32} className="text-[#52525b]" strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-display font-semibold text-on-surface/70 mb-2">{title}</h3>
      <p className="text-sm text-[#a1a1aa] max-w-md">{description}</p>
    </div>
  );
}

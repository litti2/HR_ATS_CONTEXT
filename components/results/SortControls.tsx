'use client';

import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface SortControlsProps {
  sortBy: string;
  onSortChange: (val: string) => void;
}

export default function SortControls({ sortBy, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-1.5 text-xs text-[#52525b] font-mono mr-1">
        <ArrowUpDown size={13} strokeWidth={1.5} />
        Sort by
      </span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs font-mono bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-on-surface rounded-xl px-3.5 py-2 pr-8 outline-none cursor-pointer hover:border-[rgba(255,255,255,0.15)] focus:border-teal-vivid/30 transition-colors appearance-none"
        >
          <option value="score" className="bg-surface-mid text-on-surface">Total Score (High to Low)</option>
          <option value="github" className="bg-surface-mid text-on-surface">GitHub Signal</option>
          <option value="experience" className="bg-surface-mid text-on-surface">Experience</option>
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" />
      </div>
    </div>
  );
}

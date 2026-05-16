'use client';

import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  scoreFilter: string;
  domainFilter: string;
  experienceFilter: string;
  onScoreChange: (val: string) => void;
  onDomainChange: (val: string) => void;
  onExperienceChange: (val: string) => void;
}

export default function FilterBar({
  scoreFilter, domainFilter, experienceFilter,
  onScoreChange, onDomainChange, onExperienceChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-xs text-[#52525b] font-mono">
        <SlidersHorizontal size={13} strokeWidth={1.5} />
        Filters
      </span>

      <FilterSelect
        value={scoreFilter}
        onChange={onScoreChange}
        options={[
          { value: 'all', label: 'All Scores' },
          { value: '60', label: 'Score ≥ 60' },
          { value: '80', label: 'Score ≥ 80' },
          { value: '90', label: 'Score ≥ 90' },
        ]}
      />

      <FilterSelect
        value={domainFilter}
        onChange={onDomainChange}
        options={[
          { value: 'all', label: 'All Domains' },
          { value: 'frontend', label: 'Frontend' },
          { value: 'backend', label: 'Backend' },
          { value: 'ml-ai', label: 'ML / AI' },
          { value: 'fullstack', label: 'Full Stack' },
          { value: 'devops', label: 'DevOps' },
        ]}
      />

      <FilterSelect
        value={experienceFilter}
        onChange={onExperienceChange}
        options={[
          { value: 'all', label: 'All Experience' },
          { value: '0-2', label: '0–2 years' },
          { value: '2-4', label: '2–4 years' },
          { value: '4+', label: '4+ years' },
        ]}
      />
    </div>
  );
}

function FilterSelect({ value, onChange, options }: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-mono bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#a1a1aa] rounded-xl px-3.5 py-2 pr-8 outline-none cursor-pointer hover:border-[rgba(255,255,255,0.15)] focus:border-primary-vivid/30 transition-colors appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-mid text-on-surface">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525b] pointer-events-none" />
    </div>
  );
}

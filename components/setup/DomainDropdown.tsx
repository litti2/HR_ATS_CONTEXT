'use client';

import { DOMAIN_LABELS, type DomainType } from '@/constants/domainSignals';
import { Code2, Server, Brain, Layers, Cloud, ChevronDown } from 'lucide-react';

const DOMAIN_ICONS: Record<DomainType, React.ReactNode> = {
  frontend: <Code2 size={14} strokeWidth={1.5} />,
  backend: <Server size={14} strokeWidth={1.5} />,
  'ml-ai': <Brain size={14} strokeWidth={1.5} />,
  fullstack: <Layers size={14} strokeWidth={1.5} />,
  devops: <Cloud size={14} strokeWidth={1.5} />,
};

interface DomainDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DomainDropdown({ value, onChange }: DomainDropdownProps) {
  return (
    <div>
      <label className="form-label">Role Domain</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field appearance-none cursor-pointer pr-12"
        >
          {(Object.entries(DOMAIN_LABELS) as [DomainType, string][]).map(([key, label]) => (
            <option key={key} value={key} className="bg-surface-mid text-on-surface">
              {label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2 text-[#52525b]">
          {DOMAIN_ICONS[value as DomainType] || <Code2 size={14} />}
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}

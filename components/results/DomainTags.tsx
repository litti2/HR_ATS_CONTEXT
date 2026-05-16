'use client';

import Badge from '@/components/shared/Badge';
import { DOMAIN_COLORS, type DomainType } from '@/constants/domainSignals';

interface DomainTagsProps {
  signals: string[];
  primaryDomain?: string | null;
  max?: number;
}

export default function DomainTags({ signals, primaryDomain, max = 4 }: DomainTagsProps) {
  const visibleSignals = signals.slice(0, max);
  const remaining = signals.length - max;
  const variant = primaryDomain ? (DOMAIN_COLORS[primaryDomain as DomainType] || 'default') : 'default';

  return (
    <div className="flex flex-wrap gap-1.5">
      {primaryDomain && (
        <Badge variant={variant === 'pill-cyan' ? 'cyan' : variant === 'pill-blue' ? 'blue' : variant === 'pill-pink' ? 'pink' : variant === 'pill-orange' ? 'orange' : 'default'}>
          {primaryDomain === 'ml-ai' ? 'ML/AI' : primaryDomain.charAt(0).toUpperCase() + primaryDomain.slice(1)} Heavy
        </Badge>
      )}
      {visibleSignals.map((signal) => (
        <span key={signal} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/35 border border-white/[0.06]">
          {signal}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-[10px] px-2 py-0.5 text-white/20">+{remaining}</span>
      )}
    </div>
  );
}

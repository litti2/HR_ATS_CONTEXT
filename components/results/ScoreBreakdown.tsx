'use client';

interface ScoreBreakdownProps {
  resumeContext?: number | null;
  domainAlignment?: number | null;
  githubSignal?: number | null;
  experience?: number | null;
  collegeTier?: number | null;
}

const METRICS = [
  { key: 'resumeContext', label: 'Resume Context', weight: 40, color: 'from-primary-vivid to-primary-light' },
  { key: 'domainAlignment', label: 'Domain Alignment', weight: 25, color: 'from-teal-vivid to-teal-light' },
  { key: 'githubSignal', label: 'GitHub Signal', weight: 20, color: 'from-sky-container to-sky' },
  { key: 'experience', label: 'Experience Level', weight: 10, color: 'from-amber-500 to-amber-300' },
  { key: 'collegeTier', label: 'College Tier', weight: 5, color: 'from-pink-500 to-pink-300' },
] as const;

export default function ScoreBreakdown(props: ScoreBreakdownProps) {
  return (
    <div className="space-y-4">
      {METRICS.map(({ key, label, weight, color }) => {
        const val = props[key as keyof ScoreBreakdownProps] ?? 0;
        // Sub-scores are on a 0-5 scale. Show fill as percentage of 5.
        const fillPercent = Math.max(0, Math.min(100, (val / 5) * 100));

        return (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1.5 font-mono">
              <span className="text-[#a1a1aa]">{label} <span className="text-[#52525b]">({weight}%)</span></span>
              <span className="text-on-surface font-semibold">{val.toFixed(1)}</span>
            </div>
            <div className="h-2 w-full bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

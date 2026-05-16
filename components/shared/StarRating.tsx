'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  score: number;
  maxScore?: number;
  size?: number;
  showNumeric?: boolean;
}

export default function StarRating({ score, maxScore = 5, size = 16, showNumeric = true }: StarRatingProps) {
  const fullStars = Math.floor(score);
  const partial = score - fullStars;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: maxScore }, (_, i) => {
          const isFull = i < fullStars;
          const isPartial = i === fullStars && partial > 0;

          return (
            <div key={i} className="relative">
              {/* Background star */}
              <Star size={size} className="text-[rgba(255,255,255,0.08)]" fill="currentColor" />
              {/* Filled star */}
              {(isFull || isPartial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: isFull ? '100%' : `${partial * 100}%` }}
                >
                  <Star size={size} className="text-amber-400" fill="currentColor" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showNumeric && (
        <span className="text-xs font-mono text-[#a1a1aa] ml-0.5">
          {score.toFixed(1)}
        </span>
      )}
    </div>
  );
}

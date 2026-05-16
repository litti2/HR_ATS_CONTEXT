'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  const strokeMap = { sm: 2.5, md: 3, lg: 3 };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={strokeMap[size]} />
        <path
          className="opacity-90"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

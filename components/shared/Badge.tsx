'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'teal' | 'blue' | 'pink' | 'orange' | 'amber' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'pill',
  teal: 'pill-teal',
  blue: 'pill-blue',
  pink: 'pill-pink',
  orange: 'pill-orange',
  amber: 'pill-amber',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 font-mono text-xs rounded-full',
};

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${variantClasses[variant]} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}

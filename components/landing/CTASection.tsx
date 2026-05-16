'use client';

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-vivid/[0.06] blur-[200px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        <div className="glass-card-static p-12 sm:p-16 text-center relative overflow-hidden">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-vivid/30 to-transparent" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary-vivid/[0.05] blur-[60px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-vivid/[0.04] blur-[80px] rounded-full" />

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-vivid/20 to-teal-vivid/10 border border-[rgba(255,255,255,0.08)] mb-8">
            <Zap size={24} className="text-primary-dim" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface mb-5 tracking-tight">
            Ready to hire <span className="gradient-text">smarter</span>?
          </h2>
          <p className="text-[#a1a1aa] max-w-lg mx-auto mb-10 text-sm sm:text-base leading-relaxed">
            Set up your first hiring cycle in under 5 minutes. Let AI handle the noise
            while you focus on the best candidates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/setup" className="btn-primary text-base px-10 py-4 group">
              Get Started
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/results" className="btn-secondary text-base px-10 py-4">
              See Demo Output
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

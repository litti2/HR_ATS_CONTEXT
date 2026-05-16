'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { APP_NAME } from '@/constants/appConfig';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-[15%] w-[600px] h-[600px] rounded-full bg-primary-vivid/[0.07] blur-[160px] animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-[15%] w-[500px] h-[500px] rounded-full bg-teal-vivid/[0.05] blur-[140px] animate-pulse-slow delay-600" />
      <div className="absolute top-[60%] left-[50%] -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-sky/[0.03] blur-[180px]" />

      {/* Floating decorative elements */}
      <div className="absolute top-[20%] right-[20%] w-2 h-2 rounded-full bg-primary-vivid/40 animate-float" />
      <div className="absolute top-[35%] left-[12%] w-1.5 h-1.5 rounded-full bg-teal-vivid/50 animate-float-delayed" />
      <div className="absolute bottom-[30%] right-[30%] w-1 h-1 rounded-full bg-sky/40 animate-float" />

      <div className="section-container relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-sm mb-10 animate-fade-up opacity-0">
          <Sparkles size={13} className="text-primary-dim" />
          <span className="text-xs font-medium text-[#a1a1aa] tracking-wide">AI-Powered Hiring Intelligence</span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-[-0.035em] leading-[1.08] mb-7 animate-fade-up opacity-0 delay-75">
          <span className="text-on-surface">Hire like a </span>
          <span className="gradient-text-hero">smart recruiter</span>
          <br />
          <span className="text-on-surface">Scale like a </span>
          <span className="gradient-text-hero">machine</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#a1a1aa] leading-relaxed mb-12 animate-fade-up opacity-0 delay-150">
          {APP_NAME} replaces keyword-matching ATS with contextual LLM reasoning —
          parsing resumes, analyzing GitHub profiles, and ranking candidates
          the way a senior engineering manager would.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 delay-225">
          <Link href="/setup" className="btn-primary text-base px-10 py-4 group">
            Start a Hiring Cycle
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/results" className="btn-secondary text-base px-10 py-4">
            View Demo Results
          </Link>
        </div>

        {/* Stats Strip */}
        <div className="mt-20 flex items-center justify-center gap-4 sm:gap-6 animate-fade-up opacity-0 delay-300">
          {[
            { value: '500+', label: 'Candidates processed' },
            { value: '<10min', label: 'Full pipeline run' },
            { value: 'Top 50', label: 'Ranked shortlist' },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="text-center px-4">
                <div className="text-xl sm:text-2xl font-display font-bold gradient-text">{value}</div>
                <div className="text-[11px] text-[#52525b] mt-1 font-mono">{label}</div>
              </div>
              {i < 2 && (
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.08)] to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

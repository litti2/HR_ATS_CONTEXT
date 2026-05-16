'use client';

import { Settings, Users, Trophy, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: <Settings size={22} strokeWidth={1.5} />,
    number: '01',
    title: 'Configure Your Role',
    description: 'Define the job title, paste the full JD, set specific requirements, and connect your Google Form for candidate intake.',
    accentColor: 'from-primary-vivid/20 to-primary-vivid/5',
    iconColor: 'text-primary-dim',
    glowColor: 'rgba(108, 62, 240, 0.06)',
  },
  {
    icon: <Users size={22} strokeWidth={1.5} />,
    number: '02',
    title: 'Candidates Apply',
    description: 'Share the Google Form on LinkedIn. Candidates submit their resumes, GitHub profiles, and academic background over your hiring window.',
    accentColor: 'from-sky/20 to-sky/5',
    iconColor: 'text-sky',
    glowColor: 'rgba(180, 197, 255, 0.06)',
  },
  {
    icon: <Trophy size={22} strokeWidth={1.5} />,
    number: '03',
    title: 'Get Your Shortlist',
    description: 'Our AI engine parses resumes, scrapes GitHub activity, and ranks the top 50 candidates with fully transparent, explainable scoring.',
    accentColor: 'from-teal-vivid/20 to-teal-vivid/5',
    iconColor: 'text-teal-dim',
    glowColor: 'rgba(40, 223, 181, 0.06)',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 relative">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-medium text-primary-dim uppercase tracking-widest mb-3">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-4 tracking-tight">
            Three steps to your shortlist
          </h2>
          <p className="text-[#a1a1aa] max-w-lg mx-auto text-sm leading-relaxed">
            From role setup to a ranked, explainable shortlist — powered by AI, controlled by you.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector Lines (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[33.3%] w-[33.3%] -translate-y-1/2 z-0">
            <div className="h-px bg-gradient-to-r from-primary-vivid/20 via-sky/15 to-teal-vivid/20" />
          </div>

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="glass-card p-8 group relative z-10 cursor-pointer"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 0%, ${step.glowColor}, transparent 70%)` }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <span className="text-6xl font-display font-bold text-[rgba(255,255,255,0.03)] select-none">
                  {step.number}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.accentColor} border border-[rgba(255,255,255,0.06)] flex items-center justify-center ${step.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-display font-semibold text-on-surface mb-3 relative z-10">
                {step.title}
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed relative z-10">
                {step.description}
              </p>

              {/* Subtle arrow indicator */}
              <div className="mt-6 flex items-center gap-1.5 text-xs text-[#52525b] group-hover:text-primary-dim transition-colors relative z-10">
                <span className="font-mono">Learn more</span>
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

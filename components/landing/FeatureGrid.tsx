'use client';

import { Brain, GitBranch, GraduationCap, ShieldCheck, Mail, Zap } from 'lucide-react';

const FEATURES = [
  {
    icon: <Brain size={20} strokeWidth={1.5} />,
    title: 'Semantic Matching',
    description: 'LLM-powered reasoning about resume context — understands depth, trajectory, and domain specialization beyond keywords.',
    gradient: 'from-primary-vivid/15 to-primary-vivid/5',
    iconColor: 'text-primary-dim',
    borderGlow: 'hover:border-primary-vivid/20',
  },
  {
    icon: <GitBranch size={20} strokeWidth={1.5} />,
    title: 'GitHub Signal',
    description: 'Scrapes contribution history, top projects, language distribution, and commit consistency to validate engineering activity.',
    gradient: 'from-teal-vivid/15 to-teal-vivid/5',
    iconColor: 'text-teal-dim',
    borderGlow: 'hover:border-teal-vivid/20',
  },
  {
    icon: <Zap size={20} strokeWidth={1.5} />,
    title: 'LLM Reasoning',
    description: 'Each candidate gets individual AI evaluation with written profile summaries, fit reasoning, and multi-dimensional scoring.',
    gradient: 'from-amber-500/15 to-amber-600/5',
    iconColor: 'text-amber-400',
    borderGlow: 'hover:border-amber-500/20',
  },
  {
    icon: <GraduationCap size={20} strokeWidth={1.5} />,
    title: 'College Intelligence',
    description: 'Fuzzy-matches colleges against a curated tier list. Used strictly as a tie-breaker, never as a primary ranking signal.',
    gradient: 'from-sky/15 to-sky/5',
    iconColor: 'text-sky',
    borderGlow: 'hover:border-sky/20',
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.5} />,
    title: 'Human-in-the-Loop',
    description: 'Zero automated emails. Every shortlisted candidate is reviewed and individually approved before any outreach is triggered.',
    gradient: 'from-emerald-500/15 to-emerald-600/5',
    iconColor: 'text-emerald-400',
    borderGlow: 'hover:border-emerald-500/20',
  },
  {
    icon: <Mail size={20} strokeWidth={1.5} />,
    title: 'Smart Outreach',
    description: 'One-click assignment dispatch to approved candidates with personalized emails. Track delivery status in real-time.',
    gradient: 'from-pink-500/15 to-pink-600/5',
    iconColor: 'text-pink-400',
    borderGlow: 'hover:border-pink-500/20',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-28 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-primary-vivid/[0.04] blur-[180px] rounded-full pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono font-medium text-teal-dim uppercase tracking-widest mb-3">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-on-surface mb-4 tracking-tight">
            Built for <span className="gradient-text">Technical Hiring</span>
          </h2>
          <p className="text-[#a1a1aa] max-w-lg mx-auto text-sm leading-relaxed">
            Every capability designed to surface the best engineering talent from noisy applicant pools
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`glass-card p-7 group cursor-pointer ${feature.borderGlow}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Icon */}
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-[rgba(255,255,255,0.06)] flex items-center justify-center ${feature.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-display font-semibold text-on-surface mb-2.5">
                {feature.title}
              </h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

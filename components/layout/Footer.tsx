import { APP_NAME, APP_VERSION } from '@/constants/appConfig';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[rgba(255,255,255,0.06)]">
      <div className="section-container py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left — Logo + Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-[#a1a1aa] hover:text-on-surface transition-colors cursor-pointer">
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-primary-vivid/40 to-teal-vivid/40">
                <Zap size={11} className="text-primary-dim" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-display font-semibold">{APP_NAME}</span>
            </Link>
            <span className="hidden sm:block w-px h-4 bg-[rgba(255,255,255,0.08)]" />
            <span className="hidden sm:block text-xs font-mono text-[#52525b]">v{APP_VERSION}</span>
          </div>

          {/* Right — Links */}
          <div className="flex items-center gap-6">
            <Link href="/setup" className="text-xs text-[#a1a1aa] hover:text-on-surface transition-colors cursor-pointer">
              Setup
            </Link>
            <Link href="/results" className="text-xs text-[#a1a1aa] hover:text-on-surface transition-colors cursor-pointer">
              Results
            </Link>
            <span className="text-xs text-[#52525b]">
              AI-powered contextual hiring
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

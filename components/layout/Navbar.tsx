'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { APP_NAME } from '@/constants/appConfig';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/setup', label: 'Setup' },
  { href: '/results', label: 'Results' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-40 rounded-2xl border transition-all duration-500 ${
        scrolled
          ? 'border-[rgba(255,255,255,0.10)] bg-[rgba(9,9,11,0.85)] shadow-lg shadow-black/20'
          : 'border-[rgba(255,255,255,0.06)] bg-[rgba(9,9,11,0.5)]'
      }`}
      style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      <div className="mx-auto max-w-7xl flex h-14 items-center justify-between px-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary-vivid to-teal-vivid transition-all duration-300 group-hover:shadow-glow-sm group-hover:scale-105">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-display font-bold tracking-tight text-on-surface">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-on-surface bg-[rgba(255,255,255,0.08)]'
                    : 'text-[#a1a1aa] hover:text-on-surface hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-primary-vivid to-teal-vivid" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 rounded-xl text-[#a1a1aa] hover:text-on-surface hover:bg-[rgba(255,255,255,0.06)] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden px-4 pb-4 animate-slide-up">
          <div className="space-y-1">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? 'text-on-surface bg-[rgba(255,255,255,0.08)]'
                      : 'text-[#a1a1aa] hover:text-on-surface hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

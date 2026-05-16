import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ContextHire Elite — Obsidian Surface System
        obsidian: '#09090B',
        surface: {
          DEFAULT: '#131315',
          dim: '#131315',
          bright: '#39393b',
          lowest: '#0e0e10',
          low: '#1c1b1d',
          mid: '#201f22',
          high: '#2a2a2c',
          highest: '#353437',
        },
        // Primary — Vibrant Purple
        primary: {
          DEFAULT: '#ccbeff',
          container: '#6c3ef0',
          dim: '#a78bfa',
          vivid: '#6c3ef0',
          muted: '#350097',
        },
        // Secondary — Electric Teal
        teal: {
          DEFAULT: '#41eec3',
          container: '#00d1a8',
          dim: '#28dfb5',
          vivid: '#00d1a8',
          muted: '#00382b',
        },
        // Tertiary — Soft Blue
        sky: {
          DEFAULT: '#b4c5ff',
          container: '#526397',
          dim: '#8ba2e0',
        },
        // Semantic
        on: {
          surface: '#e5e1e4',
          'surface-variant': '#cac3d8',
          primary: '#350097',
          secondary: '#00382b',
        },
        outline: {
          DEFAULT: '#948ea1',
          variant: '#494455',
        },
        glass: {
          edge: 'rgba(255, 255, 255, 0.12)',
          fill: 'rgba(15, 15, 18, 0.6)',
          'fill-hover': 'rgba(25, 25, 32, 0.7)',
        },
        error: '#ffb4ab',
      },
      fontFamily: {
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'linear-gradient(135deg, #6c3ef0 0%, #2563EB 50%, #28dfb5 100%)',
        'btn-primary': 'linear-gradient(135deg, #6c3ef0 0%, #5b2de0 50%, #4d1dd4 100%)',
        'btn-teal': 'linear-gradient(135deg, #00d1a8 0%, #28dfb5 50%, #41eec3 100%)',
        'glow-purple': 'radial-gradient(circle at center, rgba(108,62,240,0.15) 0%, transparent 70%)',
        'glow-teal': 'radial-gradient(circle at center, rgba(40,223,181,0.10) 0%, transparent 70%)',
        'glow-blue': 'radial-gradient(circle at center, rgba(180,197,255,0.08) 0%, transparent 70%)',
        'card-sheen': 'linear-gradient(135deg, rgba(108,62,240,0.06) 0%, rgba(40,223,181,0.03) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(108, 62, 240, 0.12)',
        'glow-md': '0 0 40px rgba(108, 62, 240, 0.18)',
        'glow-lg': '0 0 80px rgba(108, 62, 240, 0.22)',
        'glow-teal': '0 0 30px rgba(40, 223, 181, 0.15)',
        'glow-teal-lg': '0 0 60px rgba(40, 223, 181, 0.2)',
        card: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(108, 62, 240, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'orbit': 'orbit 20s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(108, 62, 240, 0.08)' },
          '100%': { boxShadow: '0 0 40px rgba(108, 62, 240, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;

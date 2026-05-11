import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Mediterranean Palette (OKLCH) ───
        // 60% — surfaces
        ivory: 'oklch(97% 0.008 75)',
        sand: 'oklch(94% 0.012 80)',
        // 30% — text & borders
        navy: 'oklch(22% 0.01 75)',
        muted: 'oklch(52% 0.01 75)',
        border: 'oklch(88% 0.01 75)',
        // 10% — accents (terra cotta used sparingly)
        gold: 'oklch(58% 0.12 42)',
        sea: 'oklch(52% 0.13 240)',
        // Pure white for cards / overlays when needed
        white: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 5vw + 1rem, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-xl':  ['clamp(2rem, 4vw + 1rem, 4rem)',      { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-lg':  ['clamp(1.75rem, 3.5vw + 1rem, 3.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-md':  ['clamp(1.5rem, 3vw + 0.5rem, 2.75rem)', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-sm':  ['clamp(1.25rem, 2.5vw + 0.5rem, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.65' }],
      },
      spacing: {
        'xs': '8px',
        's': '16px',
        'm': '24px',
        'l': '40px',
        'xl': '80px',
        'xxl': '180px',
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      maxWidth: {
        'hut': '1624px',
        '8xl': '88rem',
        '9xl': '96rem',
      },
      borderRadius: {
        // Editorial sharp corners — no generic rounded rectangles
        card: '0px',
        btn: '0px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.32, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.32, 1) forwards',
        'clip-reveal': 'clipReveal 0.9s cubic-bezier(0.16, 1, 0.32, 1) forwards',
        'marquee': 'marquee 30s linear infinite',
        'scroll-dot': 'scrollDot 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s linear infinite',
        'border-dance': 'borderDance 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        clipReveal: {
          '0%':   { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollDot: {
          '0%':   { transform: 'translateY(0)', opacity: '1' },
          '50%':  { transform: 'translateY(40px)', opacity: '0' },
          '51%':  { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        textShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        borderDance: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      boxShadow: {
        // BAN 3: no generic drop shadows on rounded rectangles.
        // Only an extremely subtle lift shadow for minimal depth when absolutely needed.
        'lift': '0 1px 3px oklch(22% 0.01 75 / 0.04)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
export default config

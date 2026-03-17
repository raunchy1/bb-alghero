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
        primary: '#094730',
        secondary: '#0a5a46',
        cream: '#f5f4ef',
        dark: '#1a1716',
        charcoal: '#272220',
        'light-grey': '#eee7df',
        grey: '#9e9790',
        'dark-grey': '#2d2725',
        white: '#ffffff',
        error: '#940f0b',
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem,6vw,5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-xl':  ['clamp(2rem,5vw,5rem)',      { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-lg':  ['clamp(1.75rem,4vw,3.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-md':  ['clamp(1.5rem,3vw,2.75rem)', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-sm':  ['clamp(1.25rem,2.5vw,2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
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
        'card': '8px',
        'btn': '4px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'clip-reveal': 'clipReveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
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
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, rgba(9,71,48,0.4) 0%, rgba(26,23,22,0.2) 50%, rgba(26,23,22,0.7) 100%)',
      },
      boxShadow: {
        'card':    '0 2px 16px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 40px rgba(0,0,0,0.12)',
        'nav':     '0 1px 8px rgba(0,0,0,0.06)',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}
export default config

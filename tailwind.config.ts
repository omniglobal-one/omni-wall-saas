import type { Config } from 'tailwindcss'

// Standard shadcn/ui token setup — colors resolve to CSS variables defined in
// app/globals.css so light/dark mode is a variable swap, not a class rewrite.
// Matches OMNI Motion's system exactly; Share's own accent (#0C6B9E, blue)
// is the only thing that differs, baked into --primary below.
//
// Share's existing codebase (25+ files) already leans on its own utility-class
// abstraction (bg-omni-ink, text-text-secondary, .card, .btn-primary, etc.) —
// rather than touch every call site, this file re-points those legacy names at
// the new shadcn CSS variables, so the same class names now resolve through
// the same palette as the rest of the suite. Component classes (.card, .btn-*,
// .badge-*, .input, .label, .skeleton) are defined in globals.css.
const config: Config = {
  darkMode: ['class'],
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.1' }],
        'display-lg': ['3.5rem', { lineHeight: '1.05' }],
        h1: ['1.875rem', { lineHeight: '1.2' }],
        'h1-lg': ['2.25rem', { lineHeight: '1.15' }],
        h2: ['1.5rem', { lineHeight: '1.25' }],
        body: ['1rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
        caption: ['0.75rem', { lineHeight: '1.4' }],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary))',
          contrast: 'hsl(var(--primary-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: 'hsl(var(--destructive))',
        // Legacy aliases — see file banner.
        omni: {
          ink: 'hsl(var(--foreground))',
          'ink-soft': 'hsl(var(--foreground) / 0.75)',
          'ink-faint': 'hsl(var(--muted-foreground))',
          surface: 'hsl(var(--card))',
          'surface-sunk': 'hsl(var(--muted))',
          border: 'hsl(var(--border))',
          bg: 'hsl(var(--background))',
        },
        bg: {
          card: 'hsl(var(--card))',
          base: 'hsl(var(--background))',
          border: 'hsl(var(--border))',
          subtle: 'hsl(var(--muted))',
        },
        text: {
          primary: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--foreground) / 0.75)',
          tertiary: 'hsl(var(--muted-foreground))',
        },
        'dark-bg-card': 'hsl(var(--card))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

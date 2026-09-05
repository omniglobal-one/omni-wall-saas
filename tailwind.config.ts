import type { Config } from 'tailwindcss'
const config: Config = {
  presets: [require('@omni/tokens/tailwind-preset')],
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./app/**/*.{js,ts,jsx,tsx,mdx}','./node_modules/@omni/ui/src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "success" dropped here — the preset now owns that key as a nested
        // {DEFAULT, soft} semantic token; a plain string would have clobbered it.
        // primary/primary-hover updated to the Step 1 confusability-nudged
        // accent (#0E7490 -> #0C6B9E) so unmigrated pages stay visually
        // consistent with the new login screen's accent tokens.
        primary: '#0C6B9E',
        'primary-hover': '#0A5882',
        secondary: '#F59E0B',
        danger: '#DC2626',
        bg: { base: '#F9FAFB', card: '#FFFFFF', border: '#E5E7EB' },
        text: { primary: '#111827', secondary: '#6B7280', tertiary: '#9CA3AF' },
        dark: {
          bg: { base: '#0A0A0A', card: '#111111', border: 'rgba(255,255,255,0.08)' },
          text: { primary: '#F9FAFB', secondary: '#9CA3AF', tertiary: '#6B7280' },
        },
      },
      // fontFamily and borderRadius dropped — the preset owns both scales now.
      borderColor: { DEFAULT: '#E5E7EB' },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05)',
        glow: '0 0 24px rgba(12, 107, 158, 0.35)',
      },
    },
  },
  plugins: [],
}
export default config

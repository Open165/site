import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
        serif: ['Noto Serif TC', 'serif'],
      },
      fontSize: {
        // From local styles in Figma
        body: ['18px', '28px'],
        body2: ['16px', '24px'],
        heading: ['22px', { lineHeight: '28px', fontWeight: 900 }],
        display: [
          '57px',
          {
            lineHeight: '64px',
            letterSpacing: '-0.01em',
            fontWeight: 300,
          },
        ],

        // NextUI token
        medium: '1em',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;

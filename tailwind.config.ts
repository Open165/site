import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Noto Sans TC', 'sans-serif'],
      serif: ['Noto Serif TC', 'serif'],
    },
    fontSize: {
      // From local styles in Figma
      body: ['16px', '24px'],
      body2: ['14px', '20px'],
      heading: ['18px', '28px'],
      display: ['57px', '64px'],
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;

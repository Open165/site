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
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
export default config;

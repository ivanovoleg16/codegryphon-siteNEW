import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        griffin: {
          blue: '#0B6DFF',
          cyan: '#38E8FF',
          dark: '#0B1020',
          gray: '#0C1324',
          light: '#F8FAFF',
        },
      },
    },
  },
  darkMode: 'class',
};

export default config;

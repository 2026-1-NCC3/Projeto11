import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'maya-teal': '#4FC3C8',
        'maya-teal-dark': '#1B6B7B',
        'maya-coral': '#E8756A',
        'maya-beige': '#D4B896',
        'maya-brown': '#8B5E3C',
        'maya-off-white': '#F8F6F3',
        'maya-dark': '#1A1A1A',
        'maya-gray-soft': '#6B7280',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        display: ['Roboto Condensed', 'sans-serif'],
      },
      borderRadius: {
        maya: '12px',
      },
      boxShadow: {
        maya: '0 4px 20px rgba(79, 195, 200, 0.15)',
        'maya-hover': '0 8px 30px rgba(79, 195, 200, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;

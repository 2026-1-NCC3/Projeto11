import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'maya-teal': '#36BDD1',
        'maya-teal-dark': '#005072',
        'maya-coral': '#F27A63',
        'maya-beige': '#E6D5B8',
        'maya-brown': '#7B4F2A',
        'maya-off-white': '#FFFFFF',
        'maya-dark': '#333333',
        'maya-gray-soft': '#949494',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      borderRadius: {
        maya: '5px',
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

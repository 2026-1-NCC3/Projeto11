import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'maya-teal': '#7FBBD0',
        'maya-teal-dark': '#165979',
        'maya-coral': '#B16850',
        'maya-beige': '#FDF1E0',
        'maya-brown': '#8A4E3B',
        'maya-off-white': '#FFFFFF',
        'maya-dark': '#333333',
        'maya-gray-soft': '#949494',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        display: ['Roboto Condensed', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
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

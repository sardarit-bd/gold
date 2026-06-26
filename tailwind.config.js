/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#fcf6ba',
          DEFAULT: '#b38728',
          dark: '#aa771c',
          glow: '#bf953f',
          accent: '#ffd700',
        },
        dark: {
          bg: '#030303',
          card: '#0a0a0c',
          border: '#201d16',
        }
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, rgba(179, 135, 40, 0.12) 0%, rgba(3, 3, 3, 0) 75%)',
        'gold-gradient': 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
        'gold-card-gradient': 'linear-gradient(180deg, rgba(15, 15, 17, 0.95) 0%, rgba(7, 7, 9, 0.98) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(179, 135, 40, 0.15)',
        'gold-glow-lg': '0 0 30px rgba(179, 135, 40, 0.35)',
        'gold-inset': 'inset 0 0 10px rgba(179, 135, 40, 0.15)',
      }
    },
  },
  plugins: [],
};

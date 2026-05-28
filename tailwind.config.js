/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lakuntza: {
          green: '#55B927',
          greenDark: '#3F981D',
          ink: '#121417',
          mist: '#F5F8F2',
          line: '#E4E9DF',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(18, 20, 23, 0.11)',
        card: '0 14px 40px rgba(18, 20, 23, 0.08)',
        green: '0 18px 46px rgba(85, 185, 39, 0.28)',
      },
    },
  },
  plugins: [],
};

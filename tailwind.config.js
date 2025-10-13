/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'player-1': '#637481',
        'player-2': '#4d4f3c',
        'player-3': '#c1b2a1',
        'player-4': '#ae4d32',
        'travelers': '#a76d17',
        'nobles': '#6165a5',
        'locals': '#3f552f',
        'money': '#ceaa03',
      },
    },
  },
  plugins: [],
}

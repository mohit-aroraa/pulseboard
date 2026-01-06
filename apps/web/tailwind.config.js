/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myblue: {
          500:  'var(--color--theme-blue)',
        }
      },
  },
  plugins: [],
}
}

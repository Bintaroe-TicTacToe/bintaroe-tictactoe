/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Bai Jamjuree", "sans-serif"],
      },
      // colors
    },
  },
  plugins: [],
};

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "custom-top": "#FFD6D7",
        "custom-bottom": "#FF7E95",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 3s ease-in-out infinite",
        "spin-slow": "spin 5s linear infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  // important: true,
};

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
      fontFamily: {
        sans: ["SUITE", "sans-serif"], // 기본 sans-serif를 SUITE로 설정
      },
      colors: {
        "custom-top": "#FFD6D7",
        "custom-bottom": "#FF7E95",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  // important: true,
};

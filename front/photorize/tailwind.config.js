// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["SUITE", "sans-serif"], // 기본 sans-serif를 SUITE로 설정
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  // important: true,
};

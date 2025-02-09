/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FDF9F0",
        second: "#FAACAA",
        thrid: "#F9D0CA"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Đặt Poppins làm mặc định
        pacifico: ['Pacifico', 'cursive'], // Thêm Pacifico vào fontFamily
      },
    },
  },
  plugins: [],
}


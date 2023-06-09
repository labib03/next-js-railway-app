const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", ...fontFamily.sans],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        light: "#FEFCF3",
        "semi-light": "#F9EBC8",
        sage: {
          50: "#f5f7f2",
          100: "#e8ebe0",
          200: "#cfd6c4",
          300: "#acba9b",
          400: "#90a17d",
          500: "#647a4f",
          600: "#4d603b",
          700: "#3d4c30",
          800: "#323e27",
          900: "#293321",
          950: "#161c12",
        },
        red: {
          50: "#fef2f2",
          100: "#ffe1e1",
          200: "#ffc8c8",
          300: "#ff9494",
          400: "#fd6c6c",
          500: "#f53e3e",
          600: "#e22020",
          700: "#be1717",
          800: "#9d1717",
          900: "#821a1a",
          950: "#470808",
        },
        champagne: {
          50: "#fdf9ed",
          100: "#f9ebc8",
          200: "#f3d894",
          300: "#edbf5c",
          400: "#e9a836",
          500: "#e1881f",
          600: "#c76718",
          700: "#a64917",
          800: "#873a19",
          900: "#6f3018",
          950: "#3f1709",
        },
        gallery: {
          50: "#f8f8f8",
          100: "#efefef",
          200: "#e4e4e4",
          300: "#d1d1d1",
          400: "#b4b4b4",
          500: "#9a9a9a",
          600: "#818181",
          700: "#6a6a6a",
          800: "#5a5a5a",
          900: "#4e4e4e",
          950: "#282828",
        },
      },
    },
  },
  plugins: [],
};

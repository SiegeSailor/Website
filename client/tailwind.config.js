import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        disabledOpacity: "0.4",
        borderWidth: {
          DEFAULT: "0.0625rem",
          small: "0.0625rem",
          medium: "0.0625rem",
          large: "0.0625rem",
        },
        radius: {
          DEFAULT: "0.5rem",
          small: "0.5rem",
          medium: "0.5rem",
          large: "0.5rem",
        },
      },
    }),
  ],
};

export default config;

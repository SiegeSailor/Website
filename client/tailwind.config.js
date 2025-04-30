import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /border-(default)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /bg-(default)-(100|200|300|400|500|600|700|800|900)/ },
    { pattern: /opacity-(0|10|20|30|40|50|60|70|80|90|100)/ },
    { pattern: /h-(10|11|12|14|16|20|24|28|64)/ },
    { pattern: /translate-y-(0|1|2|3|4|5|6|7|8|9|10|11|12|14|16)/ },
  ],
  theme: {
    extend: {
      inset: {
        "-1": "-0.425rem",
      },
      animation: {
        blink: "blink 1s step-start infinite",
      },
      keyframes: {
        blink: {
          "50%": { opacity: "0" },
        },
      },
    },
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

import { heroui } from "@heroui/react";

// Accent: a calm petrol-teal (credible for cloud / DevOps + medical device
// work, and deliberately not the default blue). Drives links, the top loader,
// and Mermaid node accents. Neutrals stay on HeroUI defaults.
const TEAL = {
  50: "#e8f3f3",
  100: "#c9e2e3",
  200: "#a3cccd",
  300: "#78b2b4",
  400: "#4f9799",
  500: "#367e80",
  600: "#2e6b6e",
  700: "#245658",
  800: "#1b4143",
  900: "#123030",
};

export default heroui({
  defaultTheme: "light",
  defaultExtendTheme: "light",
  layout: {
    disabledOpacity: "0.4",
    borderWidth: {
      small: "0.0625rem",
      medium: "0.0625rem",
      large: "0.0625rem",
    },
    radius: {
      small: "0.5rem",
      medium: "0.5rem",
      large: "0.5rem",
    },
  },
  themes: {
    light: {
      colors: {
        primary: { ...TEAL, DEFAULT: TEAL[600], foreground: "#ffffff" },
      },
    },
    dark: {
      colors: {
        primary: { ...TEAL, DEFAULT: TEAL[300], foreground: "#0b0f0f" },
      },
    },
  },
});

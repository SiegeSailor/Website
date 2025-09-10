import { create } from "zustand";

type TState = {
  colors: {
    [key in
      | "background"
      | "default100"
      | "default200"
      | "default300"
      | "default400"
      | "default50"
      | "default500"
      | "default600"
      | "default700"
      | "default800"
      | "default900"
      | "foreground"]: string;
  };
  setColors: (colors: Partial<TState["colors"]>) => void;
  isColorsInitialized: boolean;
  isMermaidInitializing: boolean;
  setIsMermaidInitializing: (isMermaidInitializing: boolean) => void;
};

export const useChartStore = create<TState>((set) => ({
  colors: {
    background: "hsl(0 0% 0%)",
    default100: "hsl(0 0% 0%)",
    default200: "hsl(0 0% 0%)",
    default300: "hsl(0 0% 0%)",
    default400: "hsl(0 0% 0%)",
    default50: "hsl(0 0% 0%)",
    default500: "hsl(0 0% 0%)",
    default600: "hsl(0 0% 0%)",
    default700: "hsl(0 0% 0%)",
    default800: "hsl(0 0% 0%)",
    default900: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 0%)",
  },
  setColors: (colors) =>
    set((state) => ({
      colors: { ...state.colors, ...colors },
      isColorsInitialized: true,
    })),
  isColorsInitialized: false,
  isMermaidInitializing: false,
  setIsMermaidInitializing: (isMermaidInitializing) =>
    set({ isMermaidInitializing }),
}));

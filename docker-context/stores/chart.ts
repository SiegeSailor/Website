import { create } from "zustand";

type TState = {
  colors: {
    [
      key in
        | "background"
        | "default50"
        | "default100"
        | "default200"
        | "default300"
        | "default400"
        | "default500"
        | "default600"
        | "default700"
        | "default800"
        | "default900"
        | "primary50"
        | "primary100"
        | "primary200"
        | "primary300"
        | "primary400"
        | "primary500"
        | "primary600"
        | "primary700"
        | "primary800"
        | "primary900"
        | "foreground"
    ]: string;
  };
  setColors: (colors: Partial<TState["colors"]>) => void;
};

export const useChartStore = create<TState>((set) => ({
  colors: {
    background: "hsl(0 0% 0%)",
    default50: "hsl(0 0% 0%)",
    default100: "hsl(0 0% 0%)",
    default200: "hsl(0 0% 0%)",
    default300: "hsl(0 0% 0%)",
    default400: "hsl(0 0% 0%)",
    default500: "hsl(0 0% 0%)",
    default600: "hsl(0 0% 0%)",
    default700: "hsl(0 0% 0%)",
    default800: "hsl(0 0% 0%)",
    default900: "hsl(0 0% 0%)",
    primary50: "hsl(0 0% 0%)",
    primary100: "hsl(0 0% 0%)",
    primary200: "hsl(0 0% 0%)",
    primary300: "hsl(0 0% 0%)",
    primary400: "hsl(0 0% 0%)",
    primary500: "hsl(0 0% 0%)",
    primary600: "hsl(0 0% 0%)",
    primary700: "hsl(0 0% 0%)",
    primary800: "hsl(0 0% 0%)",
    primary900: "hsl(0 0% 0%)",
    foreground: "hsl(0 0% 0%)",
  },
  setColors: (colors) =>
    set((state) => ({
      colors: { ...state.colors, ...colors },
      isColorsInitialized: true,
    })),
}));

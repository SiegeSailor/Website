import { create } from "zustand";

type TState = {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  hideMenu: () => void;
};

export const useHeaderStore = create<TState>((set, get) => ({
  isMenuOpen: false,
  setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  hideMenu: () => set({ isMenuOpen: false }),
}));

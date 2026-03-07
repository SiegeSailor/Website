import { create } from "zustand";

import { TProfile } from "@/helpers/server/document";

export type TState = {
  profile: TProfile | null;
  setProfile: (profile: TProfile) => void;
};

export const useDocumentStore = create<TState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

import { create } from "zustand";

import { TArticle } from "@/helpers/server/article";

export type TState = {
  articles: TArticle[];
  parseArticles: (articles: TArticle[]) => void;
};

export const useArticleStore = create<TState>((set) => ({
  articles: [],
  parseArticles: (articles) => set({ articles }),
}));

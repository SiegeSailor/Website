import { create } from "zustand";

import { TArticle } from "@/helper/server/article";

export type TState = {
  articles: TArticle[];
  uniqueCategories: string[];
  uniqueStatuses: string[];
  uniqueTechnologies: string[];
  parseArticles: (articles: TArticle[]) => void;
};

export const useArticleStore = create<TState>((set) => ({
  articles: [],
  uniqueCategories: [],
  uniqueStatuses: [],
  uniqueTechnologies: [],
  parseArticles: (articles) => {
    const categories = new Set<string>(),
      statuses = new Set<string>(),
      technologies = new Set<string>();

    articles.forEach((article) => {
      categories.add(article.metadata.category);
      statuses.add(article.metadata.status);
      article.metadata.technologies.forEach((technology) =>
        technologies.add(technology)
      );
    });

    set({
      articles,
      uniqueCategories: Array.from(categories),
      uniqueStatuses: Array.from(statuses),
      uniqueTechnologies: Array.from(technologies),
    });
  },
}));

import { create } from "zustand";
import { Selection, SortDescriptor } from "@heroui/react";

import { getArticles } from "@/helper/server/article";

type TState = {
  articles: Awaited<ReturnType<typeof getArticles>>;
  uniqueCategories: string[];
  uniqueStatuses: string[];
  uniqueTechnologies: string[];
  parseArticles: (articles: TState["articles"]) => void;
  filter: string;
  setFilter: (filter: string) => void;
  category: Selection;
  setCategory: (category: Selection) => void;
  status: Selection;
  setStatus: (status: Selection) => void;
  technologies: Selection;
  setTechnologies: (technologies: Selection) => void;
  columns: Selection;
  setColumns: (columns: Selection) => void;
  page: number;
  setPage: (page: number) => void;
  resetPage: () => void;
  forwardPage: () => void;
  backwardPage: () => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void;
};

export const useBlogStore = create<TState>((set, get) => ({
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
  filter: "",
  setFilter: (filter) => set({ filter }),
  category: "all",
  setCategory: (category) => set({ category }),
  status: "all",
  setStatus: (status) => set({ status }),
  technologies: "all",
  setTechnologies: (technologies) => set({ technologies }),
  columns: "all",
  setColumns: (columns) => set({ columns }),
  page: 1,
  setPage: (page) => set({ page }),
  resetPage: () => set({ page: 1 }),
  forwardPage: () => set({ page: get().page + 1 }),
  backwardPage: () => set({ page: get().page - 1 }),
  rowsPerPage: 10,
  setRowsPerPage: (rows) => set({ rowsPerPage: rows }),
  sortDescriptor: { column: "date", direction: "descending" },
  setSortDescriptor: (sortDescriptor) => set({ sortDescriptor }),
}));

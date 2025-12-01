import { create } from "zustand";
import { Selection, SortDescriptor } from "@heroui/react";

import { ROWS_PER_PAGE } from "@/setting/site";

export type TState = {
  lengthMatched: number;
  setLengthMatched: (length: number) => void;
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
  rowsPerPage: (typeof ROWS_PER_PAGE)[number];
  setRowsPerPage: (rows: (typeof ROWS_PER_PAGE)[number]) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void;
  resetSearch: () => void;
};

export const useBlogStore = create<TState>((set, get) => ({
  lengthMatched: 0,
  setLengthMatched: (length) => set({ lengthMatched: length }),
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
  rowsPerPage: ROWS_PER_PAGE[0],
  setRowsPerPage: (rows) => set({ rowsPerPage: rows }),
  sortDescriptor: { column: "date", direction: "descending" },
  setSortDescriptor: (sortDescriptor) => set({ sortDescriptor }),
  resetSearch: () =>
    set({
      filter: "",
      category: "all",
      status: "all",
      technologies: "all",
      columns: "all",
      page: 1,
      rowsPerPage: 10,
      sortDescriptor: { column: "date", direction: "descending" },
    }),
}));

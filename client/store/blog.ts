import { create } from "zustand";
import { Selection, SortDescriptor } from "@heroui/react";

import { STATUS } from "@/setting/site";

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
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void;
};

export const useBlogStore = create<TState>((set, get) => ({
  lengthMatched: 0,
  setLengthMatched: (length) => set({ lengthMatched: length }),
  filter: "",
  setFilter: (filter) => set({ filter }),
  category: "all",
  setCategory: (category) => set({ category }),
  status: new Set(["Ready"] satisfies (typeof STATUS)[number][]),
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

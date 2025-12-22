"use client";

import { useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { TArticle } from "@/helper/server/article";
import { useArticleStore } from "@/store/article";
import { useBlogStore } from "@/store/blog";
import ChipCategory from "@/component/ChipCategory";
import ChipStatus from "@/component/ChipStatus";
import ContentBottom from "./ContentBottom";
import ContentTop from "./ContentTop";
import Link from "@/component/Link";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export const COLUMNS: {
  key: keyof TArticle["metadata"];
  label: string;
  isSortable: boolean;
}[] = [
  { key: "date", label: "Date", isSortable: true },
  { key: "status", label: "Status", isSortable: false },
  { key: "category", label: "Category", isSortable: true },
  { key: "minutes", label: "Read Time", isSortable: true },
  { key: "title", label: "Title", isSortable: true },
  { key: "technologies", label: "Technologies", isSortable: false },
] as const;

function renderCell(
  article: TArticle,
  keyColumn: (typeof COLUMNS)[number]["key"]
) {
  const { metadata } = article;
  const { category, date, status, technologies, title, minutes, route } =
    metadata;

  switch (keyColumn) {
    case "category":
      return <ChipCategory category={category} />;
    case "date":
      return <p className="font-light">{date}</p>;
    case "status":
      return <ChipStatus status={status} />;
    case "technologies":
      return (
        <ScrollShadowTechnologies
          technologies={technologies}
          propsItem={{
            className: "text-foreground",
            variant: "bordered",
            size: "md",
          }}
          propsIcon={{ color: "default" }}
        />
      );
    case "title":
      return (
        <Link className="font-normal" href={route}>
          {title}
        </Link>
      );
    case "minutes":
      return <p className="font-light">{minutes} Minutes</p>;
    default:
      return <p>{String(metadata[keyColumn])}</p>;
  }
}

export default function () {
  const articles = useArticleStore((state) => state.articles);
  const category = useBlogStore((state) => state.category);
  const columns = useBlogStore((state) => state.columns);
  const filter = useBlogStore((state) => state.filter);
  const setLengthMatched = useBlogStore((state) => state.setLengthMatched);
  const setSortDescriptor = useBlogStore((state) => state.setSortDescriptor);
  const sortDescriptor = useBlogStore((state) => state.sortDescriptor);
  const status = useBlogStore((state) => state.status);
  const technologies = useBlogStore((state) => state.technologies);
  const uniqueCategories = useArticleStore((state) => state.uniqueCategories);
  const uniqueStatuses = useArticleStore((state) => state.uniqueStatuses);
  const uniqueTechnologies = useArticleStore(
    (state) => state.uniqueTechnologies
  );
  const page = useBlogStore((state) => state.page);
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);

  const headers = useMemo(() => {
    if (columns === "all") return COLUMNS;
    return COLUMNS.filter((column) => Array.from(columns).includes(column.key));
  }, [columns]);

  const isFiltering = filter.trim().length > 0;
  const itemMatched = useMemo(() => {
    let results = articles;

    if (isFiltering) {
      results = articles.filter((article) =>
        article.metadata.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (
      category !== "all" &&
      Array.from(category).length !== uniqueCategories.length
    )
      results = results.filter((article) =>
        category.has(article.metadata.category)
      );
    if (status !== "all" && Array.from(status).length !== uniqueStatuses.length)
      results = results.filter((article) =>
        status.has(article.metadata.status)
      );
    if (
      technologies !== "all" &&
      Array.from(technologies).length !== uniqueTechnologies.length
    )
      results = results.filter((article) =>
        article.metadata.technologies.some((technology) =>
          technologies.has(technology)
        )
      );

    return results;
  }, [
    articles,
    category,
    filter,
    isFiltering,
    status,
    technologies,
    uniqueCategories,
    uniqueStatuses,
    uniqueTechnologies,
  ]);

  useEffect(() => {
    setLengthMatched(itemMatched.length);
  }, [itemMatched.length, setLengthMatched]);

  const itemsCurrentPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return itemMatched.slice(start, end);
  }, [itemMatched, page, rowsPerPage]);

  const itemsSorted = useMemo(() => {
    return itemsCurrentPage.sort((left, right) => {
      const first =
        left.metadata[sortDescriptor.column as keyof typeof left.metadata];
      const second =
        right.metadata[sortDescriptor.column as keyof typeof right.metadata];

      let result = 0;
      if (typeof first === "string" && typeof second === "string")
        result = first.localeCompare(second);
      if (typeof first === "number" && typeof second === "number")
        result = first - second;

      return sortDescriptor.direction === "descending" ? -result : result;
    });
  }, [sortDescriptor, itemsCurrentPage]);

  const pageTotal = useMemo(() => {
    return Math.max(1, Math.ceil(itemMatched.length / rowsPerPage));
  }, [itemMatched.length, rowsPerPage]);

  return (
    <Table
      aria-label="Articles"
      bottomContent={<ContentBottom pageTotal={pageTotal} />}
      bottomContentPlacement="outside"
      classNames={{ wrapper: "min-h-[557px]", td: "whitespace-nowrap h-12" }}
      isHeaderSticky
      layout="auto"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={<ContentTop />}
      topContentPlacement="outside"
    >
      <TableHeader columns={headers}>
        {(column) => (
          <TableColumn
            key={column.key}
            allowsSorting={column.isSortable}
            className="uppercase"
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={itemsSorted} emptyContent="No articles found.">
        {(item) => (
          <TableRow key={item.filename}>
            {(column) => {
              const key = column as keyof TArticle["metadata"];
              return <TableCell>{renderCell(item, key)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

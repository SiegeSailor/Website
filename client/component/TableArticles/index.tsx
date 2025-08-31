"use client";

import { useEffect, useMemo } from "react";
import {
  Chip,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import { getArticles } from "@/helper/server/article";
import { STATUS_COLOR } from "@/setting/site";
import { useBlogStore } from "@/store/blog";
import ContentBottom from "./ContentBottom";
import ContentTop from "./ContentTop";
import Link from "@/component/Link";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export const COLUMNS: {
  key: keyof Awaited<ReturnType<typeof getArticles>>[number]["metadata"];
  label: string;
  isSortable: boolean;
}[] = [
  { key: "date", label: "Date", isSortable: true },
  { key: "status", label: "Status", isSortable: false },
  { key: "category", label: "Category", isSortable: true },
  { key: "title", label: "Title", isSortable: true },
  { key: "technologies", label: "Technologies", isSortable: false },
  { key: "minutes", label: "Read Time", isSortable: true },
] as const;

function renderCell(
  article: Awaited<ReturnType<typeof getArticles>>[number],
  keyColumn: (typeof COLUMNS)[number]["key"]
) {
  switch (keyColumn) {
    case "date":
      return <div>{article.metadata.date}</div>;
    case "status":
      const status = article.metadata[keyColumn];
      return (
        <Chip size="md" variant="flat" color={STATUS_COLOR[status]}>
          {status}
        </Chip>
      );
    case "technologies":
      const technologies = article.metadata[keyColumn];
      return (
        <ScrollShadowTechnologies
          propsContainer={{ className: "w-64" }}
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
      const title = article.metadata[keyColumn];
      return (
        <ScrollShadow className="w-96" orientation="horizontal">
          <Link href={article.metadata.route}>{title}</Link>
        </ScrollShadow>
      );
    case "minutes":
      const minutes = article.metadata[keyColumn];
      return <div>{minutes} Minutes</div>;
    default:
      return <div>{String(article.metadata[keyColumn])}</div>;
  }
}

export default function ({
  articles,
}: Readonly<{ articles: Awaited<ReturnType<typeof getArticles>> }>) {
  const columns = useBlogStore((state) => state.columns);
  const filter = useBlogStore((state) => state.filter);
  const parseArticles = useBlogStore((state) => state.parseArticles);
  const setSortDescriptor = useBlogStore((state) => state.setSortDescriptor);
  const sortDescriptor = useBlogStore((state) => state.sortDescriptor);
  const category = useBlogStore((state) => state.category);
  const status = useBlogStore((state) => state.status);
  const technologies = useBlogStore((state) => state.technologies);
  const uniqueCategories = useBlogStore((state) => state.uniqueCategories);
  const uniqueStatuses = useBlogStore((state) => state.uniqueStatuses);
  const uniqueTechnologies = useBlogStore((state) => state.uniqueTechnologies);
  const page = useBlogStore((state) => state.page);
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);

  useEffect(() => {
    parseArticles(articles);
  }, [articles, parseArticles]);

  const headers = useMemo(() => {
    if (columns === "all") return COLUMNS;
    return COLUMNS.filter((column) => Array.from(columns).includes(column.key));
  }, [columns]);

  const isFiltering = filter.trim().length > 0;
  const itemsFiltered = useMemo(() => {
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
  const itemsCurrentPage = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return itemsFiltered.slice(start, end);
  }, [itemsFiltered, page, rowsPerPage]);
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
    return Math.max(1, Math.ceil(itemsFiltered.length / rowsPerPage));
  }, [itemsFiltered.length, rowsPerPage]);

  return (
    <Table
      aria-label="Articles"
      bottomContent={<ContentBottom pageTotal={pageTotal} />}
      bottomContentPlacement="outside"
      classNames={{ td: "whitespace-nowrap h-12" }}
      isHeaderSticky
      layout="auto"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={<ContentTop />}
      topContentPlacement="outside"
      maxTableHeight={800}
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
              const key = column as keyof Awaited<
                ReturnType<typeof getArticles>
              >[number]["metadata"];
              return <TableCell>{renderCell(item, key)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

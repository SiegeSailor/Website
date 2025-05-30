"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon } from "lucide-react";

import { getArticles } from "@/helper/article";
import { STATUS_COLOR } from "@/setting/site";
import DropdownMetadata from "@/component/TableArticles/DropdownMetadata";
import Link from "@/component/Link";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

const COLUMNS: {
  key: keyof Awaited<ReturnType<typeof getArticles>>[number]["metadata"];
  label: string;
  isSortable: boolean;
}[] = [
  { key: "date", label: "Date", isSortable: true },
  { key: "category", label: "Category", isSortable: true },
  { key: "status", label: "Status", isSortable: false },
  { key: "title", label: "Title", isSortable: true },
  { key: "technologies", label: "Technologies", isSortable: false },
  { key: "minutes", label: "Read Minutes", isSortable: true },
] as const;

export default function ({
  articles,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  const categoryUniques = useMemo(() => {
    const categorySet = new Set<string>();
    articles.forEach((article) => {
      categorySet.add(article.metadata.category);
    });
    return Array.from(categorySet).map((category) => ({
      key: category,
      label: category,
    }));
  }, [articles]);
  const statusUniques = useMemo(() => {
    const statusSet = new Set<string>();
    articles.forEach((article) => {
      statusSet.add(article.metadata.status);
    });
    return Array.from(statusSet).map((status) => ({
      key: status,
      label: status,
    }));
  }, [articles]);
  const technologyUniques = useMemo(() => {
    const technologySet = new Set<string>();
    articles.forEach((article) => {
      article.metadata.technologies.forEach((technology) =>
        technologySet.add(technology)
      );
    });
    return Array.from(technologySet).map((technology) => ({
      key: technology,
      label: technology,
    }));
  }, [articles]);

  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState<Selection>("all");
  const [status, setStatus] = useState<Selection>("all");
  const [technologies, setTechnologies] = useState<Selection>("all");
  const [columns, setColumns] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isFiltering = Boolean(filter);

  const itemsFiltered = useMemo(() => {
    let results = articles;

    if (isFiltering)
      results = articles.filter((article) =>
        article.metadata.title.toLowerCase().includes(filter.toLowerCase())
      );

    if (
      category !== "all" &&
      Array.from(category).length !== categoryUniques.length
    )
      results = results.filter((article) =>
        category.has(article.metadata.category)
      );
    if (status !== "all" && Array.from(status).length !== statusUniques.length)
      results = results.filter((article) =>
        status.has(article.metadata.status)
      );
    if (
      technologies !== "all" &&
      Array.from(technologies).length !== technologyUniques.length
    )
      results = results.filter((article) =>
        article.metadata.technologies.some((technology) =>
          technologies.has(technology)
        )
      );

    return results;
  }, [
    articles,
    isFiltering,
    filter,
    technologies,
    technologyUniques,
    status,
    statusUniques,
    category,
    categoryUniques,
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
      const result = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -result : result;
    });
  }, [sortDescriptor, itemsCurrentPage]);
  const pageTotal = Math.max(Math.ceil(itemsFiltered.length / rowsPerPage), 1);
  const headers = useMemo(() => {
    if (columns === "all") return COLUMNS;
    return COLUMNS.filter((column) => Array.from(columns).includes(column.key));
  }, [columns]);

  const renderCell = useCallback(
    (
      article: (typeof articles)[number],
      keyColumn: (typeof COLUMNS)[number]["key"]
    ) => {
      switch (keyColumn) {
        case "date":
          return (
            <div>{new Date(article.metadata.date).toLocaleDateString()}</div>
          );
        case "status":
          const status = article.metadata[keyColumn];
          return (
            <div>
              <Chip size="md" variant="flat" color={STATUS_COLOR[status]}>
                {status}
              </Chip>
            </div>
          );
        case "technologies":
          const technologies = article.metadata[keyColumn];
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
          const title = article.metadata[keyColumn];
          return (
            <Link href={`/blog/${article.metadata.date}`} className="text-base">
              {title}
            </Link>
          );
        default:
          return <div>{String(article.metadata[keyColumn])}</div>;
      }
    },
    [articles]
  );

  const contentTop = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end flex-wrap">
          <Input
            isClearable
            className="w-full md:w-1/4"
            placeholder="Search by Title"
            startContent={
              <SearchIcon
                size="1.45rem"
                className="text-default-400 flex-shrink-0"
              />
            }
            value={filter}
            onClear={() => {
              setFilter(() => "");
              setPage(() => 1);
            }}
            onValueChange={(value) => {
              setFilter(() => value);
              if (value) setPage(() => 1);
            }}
          />
          <div className="flex gap-3">
            <DropdownMetadata
              items={category}
              setItems={setCategory}
              columns={columns}
              metadata="category"
              uniques={categoryUniques}
            />
            <DropdownMetadata
              items={status}
              setItems={setStatus}
              columns={columns}
              metadata="status"
              uniques={statusUniques}
            />
            <DropdownMetadata
              items={technologies}
              setItems={setTechnologies}
              columns={columns}
              metadata="technologies"
              uniques={technologyUniques}
            />
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={columns}
                selectionMode="multiple"
                onSelectionChange={setColumns}
              >
                {COLUMNS.map((column) => (
                  <DropdownItem key={column.key}>{column.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {articles.length} articles
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent text-default-400 text-small"
              onChange={(event) => {
                setRowsPerPage(() => Number(event.target.value));
                setPage(() => 1);
              }}
              value={rowsPerPage}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filter,
    setFilter,
    articles.length,
    isFiltering,
    technologies,
    setTechnologies,
    technologyUniques,
    category,
    setCategory,
    categoryUniques,
    status,
    setStatus,
    statusUniques,
    columns,
    setColumns,
    rowsPerPage,
    setRowsPerPage,
    setPage,
  ]);

  const contentBottom = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={pageTotal}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pageTotal === 1}
            size="md"
            variant="flat"
            onPress={() => {
              if (page > 1) setPage(() => page - 1);
            }}
          >
            Previous
          </Button>
          <Button
            isDisabled={pageTotal === 1}
            size="md"
            variant="flat"
            onPress={() => {
              if (page < pageTotal) setPage(() => page + 1);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, []);

  return (
    <Table
      aria-label="Articles"
      bottomContent={contentBottom}
      bottomContentPlacement="outside"
      classNames={{ td: "whitespace-nowrap h-12" }}
      isHeaderSticky
      layout="auto"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={contentTop}
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
      <TableBody items={itemsSorted}>
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

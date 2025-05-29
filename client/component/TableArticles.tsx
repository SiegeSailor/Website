"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Button,
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
import { LuSearch, LuChevronDown } from "react-icons/lu";

import { getArticles } from "@/helper/article";
import Link from "@/component/Link";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

const COLUMNS: {
  key: keyof Awaited<ReturnType<typeof getArticles>>[number]["metadata"];
  label: string;
  isSortable: boolean;
}[] = [
  { key: "date", label: "Date", isSortable: true },
  { key: "title", label: "Title", isSortable: true },
  { key: "minutes", label: "Read Time", isSortable: true },
  { key: "tags", label: "Technologies", isSortable: false },
] as const;

export default function ({
  articles,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  const tagUniques = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      article.metadata.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).map((tag) => ({ key: tag, label: tag }));
  }, [articles]);

  const [filter, setFilter] = useState("");
  const [tags, setTags] = useState<Selection>("all");
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
    if (tags !== "all" && Array.from(tags).length !== tagUniques.length)
      results = results.filter((article) =>
        article.metadata.tags.some((tag) => tags.has(tag))
      );

    return results;
  }, [articles, isFiltering, filter, tags, tagUniques]);
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
          return <div>{article.metadata.date}</div>;
        case "minutes":
          const minutes = article.metadata[keyColumn];
          return <div>{minutes} Minutes</div>;
        case "tags":
          const tags = article.metadata[keyColumn];
          return (
            <ScrollShadowTechnologies
              tags={tags}
              propsChip={{ className: "text-foreground" }}
            />
          );
        case "title":
          const title = article.metadata[keyColumn];
          return <Link href={`/blog/${article.metadata.date}`}>{title}</Link>;
        default:
          return <div>{String(article.metadata[keyColumn])}</div>;
      }
    },
    [articles]
  );

  const contentTop = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by Title"
            startContent={
              <LuSearch
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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<LuChevronDown />} variant="flat">
                  Technologies
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Technologies"
                closeOnSelect={false}
                selectedKeys={tags}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  console.log("Selected Tags:", keys);
                  setTags(keys);
                }}
              >
                {tagUniques.map((tag) => (
                  <DropdownItem key={tag.key}>{tag.label}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<LuChevronDown />} variant="flat">
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
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={(event) => {
                setRowsPerPage(() => Number(event.target.value));
                setPage(() => 1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filter, tags, articles.length, isFiltering, columns]);

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
      classNames={{ td: "whitespace-nowrap" }}
      isHeaderSticky
      layout="auto"
      onSortChange={setSortDescriptor}
      sortDescriptor={sortDescriptor}
      topContent={contentTop}
      topContentPlacement="outside"
      maxTableHeight={800}
      rowHeight={80}
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

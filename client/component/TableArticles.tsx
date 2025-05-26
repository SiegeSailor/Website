"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { getArticles } from "@/helper/article";

const COLUMNS: {
  key: keyof Awaited<ReturnType<typeof getArticles>>[0]["metadata"];
  label: string;
}[] = [
  { key: "title", label: "Title" },
  { key: "tags", label: "Tags" },
  { key: "date", label: "Date" },
] as const;

export default function ({
  articles,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  return (
    <Table
      isHeaderSticky
      isVirtualized
      aria-label="Articles"
      maxTableHeight={200}
      rowHeight={40}
    >
      <TableHeader columns={COLUMNS}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={articles}>
        {(item) => (
          <TableRow key={item.filename}>
            {(column) => {
              const key = column as keyof typeof item.metadata;
              return <TableCell>{item.metadata[key]}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

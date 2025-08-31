"use client";

import { Button, Pagination } from "@heroui/react";

import { useBlogStore } from "@/store/blog";

export default function ({ pageTotal }: Readonly<{ pageTotal: number }>) {
  const page = useBlogStore((state) => state.page);
  const setPage = useBlogStore((state) => state.setPage);

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
          isDisabled={page === 1}
          size="md"
          variant="flat"
          onPress={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          Previous
        </Button>
        <Button
          isDisabled={page === pageTotal}
          size="md"
          variant="flat"
          onPress={() => {
            if (page < pageTotal) setPage(page + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

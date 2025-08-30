import { Button, Pagination } from "@heroui/react";

import { useBlogStore } from "@/store/blog";

export default function () {
  const page = useBlogStore((state) => state.page);
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);
  const setPage = useBlogStore((state) => state.setPage);

  const itemsFiltered = 10;
  const pageTotal = Math.max(1, Math.ceil(itemsFiltered / rowsPerPage));

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
            if (page > 1) setPage(page - 1);
          }}
        >
          Previous
        </Button>
        <Button
          isDisabled={pageTotal === 1}
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

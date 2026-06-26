import { memo } from "react";
import { tableDefaultState } from "../../types";
import { cn } from "@/lib";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/common/pagination";
import { useTableStore } from "../../context";

export interface TablePaginationProps {
  loading?: boolean;
}

export const TablePagination = memo(({ loading }: TablePaginationProps) => {
  const page = useTableStore((s) => s.page) ?? tableDefaultState.page;
  const rows = useTableStore((s) => s.rows) ?? tableDefaultState.rows;
  const totalRecords = useTableStore((s) => s.totalRecords) ?? 0;
  const setPage = useTableStore((s) => s.setPage);

  const handleChange = (newPage: number) => {
    if (loading) return;
    setPage(newPage);
  };

  const totalPages = Math.ceil(
    (totalRecords || 0) / (rows || tableDefaultState.rows!),
  );
  const currentPage = page ?? tableDefaultState.page!;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    pages.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => !loading && handleChange(0)}
          isActive={currentPage === 0}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 2, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages - 2, maxVisiblePages - 1);
    }
    if (currentPage >= totalPages - halfVisible - 1) {
      startPage = Math.max(1, totalPages - maxVisiblePages);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => !loading && handleChange(i)}
            isActive={i === currentPage}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    if (totalPages > 1) {
      pages.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => !loading && handleChange(totalPages - 1)}
            isActive={currentPage === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <Pagination
      variant="outline"
      className="h-14 rounded-md border-border dir-ltr"
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={() => !loading && handleChange(0)}
            className={cn(
              currentPage === 0 && "pointer-events-none opacity-50",
            )}
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              !loading && currentPage > 0 && handleChange(currentPage - 1)
            }
            className={cn(
              currentPage === 0 && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              !loading &&
              currentPage < totalPages - 1 &&
              handleChange(currentPage + 1)
            }
            className={cn(
              currentPage >= totalPages - 1 && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            onClick={() => !loading && handleChange(totalPages - 1)}
            className={cn(
              currentPage >= totalPages - 1 && "pointer-events-none opacity-50",
            )}
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
});

TablePagination.displayName = "TablePagination";
export default TablePagination;

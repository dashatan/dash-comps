import { memo } from "react";
import {
  ChangeTag,
  TableData,
  tableDefaultState,
} from "@/components/compound/table/types";
import { useFormContext } from "react-hook-form";
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

export interface TablePaginationProps {
  values?: TableData;
  onchange: (values: TableData, tag: ChangeTag) => void;
  loading?: boolean;
}

export const TablePagination = memo(
  ({ onchange, loading, values }: TablePaginationProps) => {
    const table = useFormContext<TableData>();
    const page = table.watch("page") || tableDefaultState.page;
    const rows = table.watch("rows") || tableDefaultState.rows;
    const { totalRecords } = values ?? {};

    const handleChange = (newPage: number) => {
      if (loading) return;
      const rowsPerPage = rows;
      const offset = newPage * rowsPerPage;
      table.setValue("page", newPage);
      table.setValue("offset", offset);

      const newState = {
        ...table.getValues(),
        first: offset,
        page: newPage,
        rows: rowsPerPage,
        offset,
      };
      onchange(newState, "filter");
    };

    const totalPages = Math.ceil(
      (totalRecords || 0) / (rows || tableDefaultState.rows),
    );
    const currentPage = page || tableDefaultState.page;

    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 3;
      const halfVisible = Math.floor(maxVisiblePages / 2);

      // Always show first page
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

      // Calculate start and end of visible pages
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 2, currentPage + halfVisible);

      // Adjust if we're near the start
      if (currentPage <= halfVisible) {
        endPage = Math.min(totalPages - 2, maxVisiblePages - 1);
      }
      // Adjust if we're near the end
      if (currentPage >= totalPages - halfVisible - 1) {
        startPage = Math.max(1, totalPages - maxVisiblePages);
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pages.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Add middle pages
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

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      // Always show last page if there is more than one page
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
                currentPage >= totalPages - 1 &&
                  "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              onClick={() => !loading && handleChange(totalPages - 1)}
              className={cn(
                currentPage === totalPages - 1 &&
                  "pointer-events-none opacity-50",
              )}
            >
              <ChevronsRight className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
);

TablePagination.displayName = "TablePagination";
export default TablePagination;

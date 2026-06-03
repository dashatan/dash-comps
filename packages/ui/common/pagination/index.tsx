"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib";
import { Button, buttonVariants } from "@/components/common/buttons";
import { VariantProps } from "class-variance-authority";
import { paginationVariants } from "./variants";

export interface PaginationProps extends VariantProps<typeof paginationVariants> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, variant, asChild, children, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn(paginationVariants({ variant, className }))}
        {...props}
      >
        {children}
      </nav>
    );
  },
);
Pagination.displayName = "Pagination";

export interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {
  asChild?: boolean;
}

const PaginationContent = React.forwardRef<HTMLUListElement, PaginationContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        data-slot="pagination-content"
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      />
    );
  },
);
PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {
  asChild?: boolean;
}

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        data-slot="pagination-item"
        className={cn("", className)}
        {...props}
      />
    );
  },
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a"> &
  VariantProps<typeof paginationVariants>;

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "sm", variant, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          "min-h-10 min-w-10",
          paginationVariants({ variant, className }),
          buttonVariants({
            variant: "contained",
            severity: isActive ? "primary" : "info",
          }),
        )}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = "PaginationLink";

export interface PaginationFirstProps extends React.ComponentProps<
  typeof PaginationLink
> {
  asChild?: boolean;
}

const PaginationFirst = React.forwardRef<HTMLAnchorElement, PaginationFirstProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to first page"
        size="sm"
        className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
        {...props}
      >
        <ChevronsLeftIcon size={16} />
      </PaginationLink>
    );
  },
);
PaginationFirst.displayName = "PaginationFirst";

export interface PaginationPreviousProps extends React.ComponentProps<
  typeof PaginationLink
> {
  asChild?: boolean;
}
const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to previous page"
        size="sm"
        className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
        {...props}
      >
        <ChevronLeftIcon size={16} />
      </PaginationLink>
    );
  },
);
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps extends React.ComponentProps<typeof PaginationLink> {
  asChild?: boolean;
}

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to next page"
        size="sm"
        className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
        {...props}
      >
        <ChevronRightIcon size={16} />
      </PaginationLink>
    );
  },
);
PaginationNext.displayName = "PaginationNext";

export interface PaginationLastProps extends React.ComponentProps<typeof PaginationLink> {
  asChild?: boolean;
}

const PaginationLast = React.forwardRef<HTMLAnchorElement, PaginationLastProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to last page"
        size="sm"
        className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
        {...props}
      >
        <ChevronsRightIcon size={16} />
      </PaginationLink>
    );
  },
);
PaginationLast.displayName = "PaginationLast";

export interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="pagination-ellipsis"
        className={cn("flex size-9 items-center justify-center", className)}
        {...props}
      >
        <MoreHorizontalIcon className="size-4" />
        <span className="sr-only">More pages</span>
      </span>
    );
  },
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
};

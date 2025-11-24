import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

import { Link } from "../link";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { useDirection } from "@/hooks/use-direction";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const size = {
  default: "px-4 py-1.5 has-[>svg]:px-3",
  sm: " rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
  lg: "rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
  "icon-sm": "size-8",
  "icon-lg": "size-10",
};

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & { size: keyof typeof size } & React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  href,
  ...props
}: PaginationLinkProps) => (
  <Link
    to={href as string}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
      "size-6 hover:bg-primary/80! "
    )}
    {...props}
  >
    {children}
  </Link>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    <ChevronLeft className="size-4 rtl:scale-x-[-1]" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("flex items-center justify-center", className)}
    {...props}
  >
    <ChevronRight className="size-4 rtl:scale-x-[-1]" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <Ellipsis className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
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
};

export interface TablePaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
  rootUrl: string; // base path (ex: /blogs)
}

export const TablePagination = ({
  totalItems,
  currentPage,
  perPage,
  rootUrl,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const [searchParams, setSearchParams] = useSearchParams();
  const dir = useDirection();

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    params.set("perPage", String(perPage));
    return `${rootUrl}?${params.toString()}`;
  };

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("per_page", value);
    setSearchParams(params);
  };

  const renderPageItems = useMemo(() => {
    const delta = 2;
    const items: React.ReactNode[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          size="sm"
          href={createHref(1)}
          className={cn(
            currentPage === 1
              ? "bg-primary font-semibold text-primary-foreground"
              : "text-foreground"
          )}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (left > 2) {
      items.push(
        <PaginationItem key="left-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = left; i <= right; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            size="sm"
            href={createHref(i)}
            className={cn(
              currentPage === i
                ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                : "text-foreground"
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (right < totalPages - 1) {
      items.push(
        <PaginationItem key="right-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            size="sm"
            href={createHref(totalPages)}
            className={cn(
              currentPage === totalPages
                ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                : "text-foreground"
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return dir === "rtl" ? items.reverse() : items;
  }, [currentPage, totalPages, dir]);

  return (
    <Pagination
      className={cn(
        "w-full items-center py-2 flex ltr:flex-row-reverse flex-col gap-3 sm:flex-row sm:justify-between"
      )}
    >
      <div
        className={cn(
          "text-sm font-medium text-left rtl:text-right text-foreground whitespace-nowrap"
        )}
      >
        {dir === "rtl"
          ? `عرض ${start} إلى ${end} من أصل ${totalItems} إدخالات`
          : `Showing ${start} to ${end} of ${totalItems} entries`}
      </div>
      <PaginationContent className="flex-row justify-center items-center gap-2  se rtl:space-x-reverse">
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            size="sm"
            href={createHref(Math.max(currentPage - 1, 1))}
            aria-disabled={currentPage <= 1}
            className={cn(
              "rounded-md transition-colors",
              currentPage <= 1
                ? "pointer-events-none text-foreground/50"
                : "text-foreground hover:bg-primary/10"
            )}
          />
        </PaginationItem>

        {/* Page numbers */}
        <div className="flex items-center justify-center gap-1 rtl:flex-row-reverse rtl:space-x-reverse">
          {renderPageItems}
        </div>

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            size="sm"
            href={createHref(Math.min(currentPage + 1, totalPages))}
            aria-disabled={currentPage >= totalPages}
            className={cn(
              "rounded-md transition-colors",
              currentPage >= totalPages
                ? "pointer-events-none text-foreground/50"
                : "text-foreground hover:bg-primary/10"
            )}
          />
        </PaginationItem>
      </PaginationContent>

      <div className={cn("flex items-center gap-2 text-sm whitespace-nowrap")}>
        <span className="text-sm font-medium">
          {dir === "rtl" ? "لكل صفحة" : "Per page"}
        </span>
        <Select value={String(perPage)} onValueChange={handlePerPageChange}>
          <SelectTrigger className="h-8 px-2 rounded-sm w-[70px] bg-background!">
            <SelectValue placeholder={String(perPage)} />
          </SelectTrigger>
          <SelectContent className="bg-background" align="end">
            {[5, 10, 15 , 25, 50].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Pagination>
  );
};

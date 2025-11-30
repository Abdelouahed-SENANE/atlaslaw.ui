import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useDirection } from "@/hooks/use-direction";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { RouterLink } from "../link";

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
    className={cn("flex flex-row items-center ", className)}
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
  <li
    ref={ref}
    className={cn("w-full h-full flex items-center justify-center", className)}
    {...props}
  />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & { size?: keyof typeof size } & React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  href,
  ...props
}: PaginationLinkProps) => (
  <RouterLink
    to={href as string}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex items-center hover: justify-center px-3 h-8 text-sm transition-colors",
      isActive
        ? " bg-card-foreground text-primary-foreground font-semibold"
        : "hover:bg-border",
      className
    )}
    {...props}
  >
    {children}
  </RouterLink>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("flex items-center h-full justify-center", className)}
    {...props}
  >
    <ChevronLeft className="size-4" />
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
    <ChevronRight className="size-4 " />
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

export interface TablePaginationProps {
  total: number;
  page: number;
  limit: number;
  rootUrl: string;
}

export const TablePagination = ({
  total,
  page,
  limit,
  rootUrl,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const [searchParams, setSearchParams] = useSearchParams();
  const dir = useDirection();

  // const start = (page - 1) * limit + 1;
  // const end = Math.min(page * limit, total);

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return `${rootUrl}?${params.toString()}`;
  };

  // const handlePerPageChange = (value: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("page", "1");
  //   params.set("limit", value);
  //   setSearchParams(params);
  // };

  const renderPageItems = useMemo(() => {
    const delta = 2;
    const items: React.ReactNode[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          size="sm"
          href={createHref(1)}
          isActive={page === 1}
          className={cn(
            page === 1
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
            aria-current={page === i ? "page" : undefined}
            href={createHref(i)}
            className={cn(
              page === i
              ? "bg-primary font-semibold text-primary-foreground"
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
              page === totalPages
                ? "bg-primary font-semibold text-primary-foreground hover:bg-primary/80"
                : "text-foreground"
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }, [page, totalPages, dir]);

  return (
    <Pagination
      className={cn(
        "w-full items-center  py-2 flex flex-col gap-3 sm:flex-row sm:justify-between"
      )}
    >

      <PaginationContent dir="ltr"
        className={cn(
          "flex items-center justify-start ltr:ml-auto  mr-1 bg-card h-9 rounded-md border border-border overflow-hidden divide-x divide-border ",
        )}
      >
        {/* Previous button */}
        <PaginationItem>
          <PaginationPrevious
            href={createHref(Math.max(page - 1, 1))}
            aria-disabled={page <= 1}
            className={cn(
              "transition-colors h-full",
              page <= 1
                ? "pointer-events-none text-foreground/50"
                : "text-foreground hover:bg-primary/10"
            )}
          />
        </PaginationItem>

        {/* Page numbers */}
        <div className="flex items-center w-full h-full justify-center ">
          {renderPageItems}
        </div>

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            size="sm"
            href={createHref(Math.min(page + 1, totalPages))}
            aria-disabled={page >= totalPages}
            className={cn(
              "rounded-md transition-colors",
              page >= totalPages
                ? "pointer-events-none text-foreground/50"
                : "text-foreground hover:bg-primary/10"
            )}
          />
        </PaginationItem>
      </PaginationContent>

      {/* <div className={cn("flex items-center gap-2 text-sm whitespace-nowrap")}>
        <span className="text-sm font-medium">
          {dir === "rtl" ? "لكل صفحة" : "Per page"}
        </span>
        <Select value={String(limit)} onValueChange={handlePerPageChange}>
          <SelectTrigger className="h-8 px-2 rounded-sm w-[70px] bg-background!">
            <SelectValue placeholder={String(limit)} />
          </SelectTrigger>
          <SelectContent className="bg-background" align="end">
            {[5, 10, 15, 25, 50].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
    </Pagination>
  );
};

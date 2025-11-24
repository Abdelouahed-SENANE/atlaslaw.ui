import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckSquare,
  Inbox,
  Square,
} from "lucide-react";
import * as React from "react";

import { BaseEntity } from "@/types/api";
import { cn } from "@/lib/utils";

import { TablePagination, TablePaginationProps } from "./table-pagination";
import { Spinner } from "../spinner";
import { useSearchParams } from "react-router-dom";

const TableElement = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm border bg-card/30 border-border ",
        className
      )}
      {...props}
    />
  </div>
));
TableElement.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("[&_tr]:border-b  bg-background", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors data-[state=selected]:bg-background",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "text-left align-middle px-4 py-2.5  text-xs text-foreground  [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  TableElement,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

export type TableColumn<Entry> = {
  title: React.ReactNode;
  field: keyof Entry;
  sortable?: boolean;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
};
export interface SortConfig<Entry> {
  key: keyof Entry | null;
  direction: "asc" | "desc";
}
export type TableProps<Entry extends BaseEntity> = {
  data: Entry[];
  columns: TableColumn<Entry>[];
  pagination?: TablePaginationProps;
  isLoading?: boolean;
  onRowSelect?: (selectedRows: Entry[]) => void;
  emptyMessage?: string; // 👈 new prop
};

export const Table = <Entry extends BaseEntity>({
  data,
  columns,
  pagination,
  isLoading = false,
  onRowSelect,
  emptyMessage = "",
}: TableProps<Entry>) => {
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(
    new Set()
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSort = (field: keyof Entry) => {
    const currentSortBy = searchParams.get("sort_by");
    const currentSortDir = searchParams.get("sort_dir") ?? "asc";

    const nextDir =
      currentSortBy === field && currentSortDir === "asc" ? "desc" : "asc";

    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", String(field));
    newParams.set("sort_dir", nextDir);
    newParams.set("page", "1");

    setSearchParams(newParams);
  };

  const toggleRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedRows(newSelected);
    onRowSelect?.(data.filter((row) => newSelected.has(row.id!)));
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const all = new Set(data.map((row) => row.id!));
      setSelectedRows(all);
      onRowSelect?.(data);
    }
  };

  return (
    <>
      <TableElement>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 size-4 bg-table-head">
              <button onClick={toggleSelectAll} className="cursor-pointer">
                {selectedRows.size === data.length ? (
                  <CheckSquare className="size-4 text-primary" />
                ) : (
                  <Square className="size-4 text-muted-foreground" />
                )}
              </button>
            </TableHead>

            {columns.map((column, index) => {
              const currentSortBy = searchParams.get("sort_by");
              const currentSortDir = searchParams.get("sort_dir") ?? "asc";

              const isActive = currentSortBy === column.field;
              const direction = isActive ? currentSortDir : "asc";

              return (
                <TableHead
                  key={index}
                  className={cn(
                    "text-md font-bold bg-table-head",
                    column.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <span className="flex items-center gap-1">
                    {column.title}
                    {column.sortable && (
                      <>
                        {isActive ? (
                          direction === "asc" ? (
                            <ArrowUp className="size-4 text-primary" />
                          ) : (
                            <ArrowDown className="size-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="size-4 opacity-50" />
                        )}
                      </>
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="w-full py-5">
                <div className="text-center text-md font-bold inline-flex items-center justify-center w-full space-x-1">
                  <Spinner size="sm" className="text-foreground/80" />
                  <p>Loading...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((entry, entryIndex) => (
              <TableRow
                key={entry.id || entryIndex}
                className={`border-b border-border hover:bg-background/50 text-sm cursor-pointer ${
                  selectedRows.has(entry.id!) ? "bg-primary/10" : ""
                }`}
                onClick={() => toggleRow(entry.id!)}
              >
                <TableCell className="text-center">
                  {selectedRows.has(entry.id!) ? (
                    <CheckSquare className="size-4 text-primary" />
                  ) : (
                    <Square className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
                {columns.map(({ Cell, field }, columnIndex) => (
                  <TableCell key={columnIndex} className="px-4">
                    {Cell ? <Cell entry={entry} /> : `${entry[field]}`}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-5"
              >
                <div className="flex justify-center items-center gap-2 text-foreground/80">
                  <Inbox className="size-5" />
                  {emptyMessage || "No Entries Found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableElement>
      {pagination && !isLoading && <TablePagination {...pagination} />}
    </>
  );
};

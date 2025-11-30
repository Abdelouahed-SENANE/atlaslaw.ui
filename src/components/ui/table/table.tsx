import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { BaseEntity } from "@/types/api";

import { useTranslation } from "react-i18next";
import { Checkbox } from "../form";
import { Spinner } from "../spinner";

const TableElement = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-md border border-border">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm  bg-card/30 ",
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
    className={cn("[&_tr]:border-b h-12  bg-background", className)}
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
      "ltr:text-left rtl:text-right align-middle px-2  py-2.5 text-base font-bold  text-card-foreground *:[[role=checkbox]]:translate-y-0.5",
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
      "p-2 align-middle  *:[[role=checkbox]]:translate-y-0.5",
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
  TableBody,
  TableCaption,
  TableCell,
  TableElement,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
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
  isLoading?: boolean;

  sortBy?: keyof Entry;
  sortDir?: "asc" | "desc";
  onSortChange?: (field: keyof Entry, direction: "asc" | "desc") => void;

  selectedRows?: Set<string | number>;
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: () => void;

  emptyMessage?: string;
};

export const Table = <Entry extends BaseEntity>({
  data,
  columns,
  isLoading = false,
  sortBy,
  sortDir = "asc",
  onSortChange,
  selectedRows,
  onSelectRow,
  onSelectAll,
  emptyMessage = "No entries found.",
}: TableProps<Entry>) => {
  const { t } = useTranslation();
  const handleSort = (field: keyof Entry) => {
    if (!onSortChange) return;

    const nextDir = sortBy === field && sortDir === "asc" ? "desc" : "asc";

    onSortChange(field, nextDir);
  };
  return (
    <TableElement > 
      {/* HEADER */}
      <TableHeader className="bg-background">
        <TableRow>
          {selectedRows && onSelectAll && (
            <TableHead className="p-2 ">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={() => onSelectAll?.()}
              />
            </TableHead>
          )}

          {columns.map((column, index) => {
            const active = sortBy === column.field;
            const direction = active ? sortDir : "asc";

            return (
              <TableHead
                key={index}
                className={` ${column.sortable ? "cursor-pointer select-none" : ""}`}
                onClick={() => column.sortable && handleSort(column.field)}
              >
                <span className="flex items-center gap-1">
                  {column.title}
                  {column.sortable &&
                    (active ? (
                      direction === "asc" ? (
                        <ArrowUp className="size-4 text-primary" />
                      ) : (
                        <ArrowDown className="size-4 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-4 opacity-50" />
                    ))}
                </span>
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      {/* BODY */}
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-5"
            >
              <div className="flex items-center justify-center gap-2 text-foreground">
                <Spinner size="sm" />
                <span>{t("loading")}</span>
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-5"
            >
              <div className="flex items-center justify-center gap-2 text-foreground">
                <Inbox className="size-5" />
                {emptyMessage}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data.map((entry, idx) => (
            <TableRow
              key={entry.id ?? idx}
              className={`hover:bg-background/50 h-10 ${
                selectedRows?.has(entry.id!) ? "bg-foreground/4" : ""
              }`}
            >
              {selectedRows && onSelectRow && (
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(entry.id!)}
                    onCheckedChange={() => onSelectRow(entry.id!)}
                  />
                </TableCell>
              )}

              {columns.map(({ Cell, field }, colIdx) => (
                <TableCell key={colIdx}>
                  {Cell ? <Cell entry={entry} /> : String(entry[field] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableElement>
  );
};

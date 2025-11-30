// hooks/use-table-controller.ts
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useTable = <T extends { id?: string | number }>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract params
  const page = Number(searchParams.get("page") || 1);
  const query = searchParams.get("query") ?? "";
  const limit = Number(searchParams.get("limit") || 10);

  const sort_by = (searchParams.get("sort_by") as keyof T) ?? "created_at";
  const sort_dir = searchParams.get("sort_dir") === "desc" ? "desc" : "asc";

  // ------------------------------
  // Selection Logic
  // ------------------------------
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );

  const toggleRow = (id: string | number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (allIds: (string | number)[]) => {
    if (selectedRows.size === allIds.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allIds));
    }
  };
  // ------------------------------
  // Query Logic
  // ------------------------------
  const setQuery = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query"); // clear filter
    }
    params.set("page", "1");
    setSearchParams(params);
  };
  // ------------------------------
  // Sorting Logic
  // ------------------------------
  const setSorting = (field: keyof T, dir: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams);
    params.set("sort_by", String(field));
    params.set("sort_dir", dir);
    params.set("page", "1");
    setSearchParams(params);
  };

  return {
    // URL params
    page,
    query,
    limit,
    sort_by,
    sort_dir,

    // selection
    selectedRows,
    toggleRow,
    toggleAll,
    
    // query
    setQuery,

    // sorting
    setSorting,
  };
};

// hooks/use-query-table.ts
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryTable = <T extends { id?: string | number }>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ===========================
  // URL PARAMS
  // ===========================
  const page = Number(searchParams.get("page") || 1);
  const query = searchParams.get("query") ?? "";
  const limit = Number(searchParams.get("limit") || 10);

  const sort_by = (searchParams.get("sort_by") as keyof T) ?? "created_at";
  const sort_dir = searchParams.get("sort_dir") === "desc" ? "desc" : "asc";

  // ===========================
  // SELECTION LOGIC
  // ===========================
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    () => new Set()
  );

  const toggleRow = useCallback((id: string | number) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((allIds: (string | number)[]) => {
    setSelectedRows(prev => {
      if (prev.size === allIds.length) {
        return new Set();
      }
      return new Set(allIds);
    });
  }, []);

  // ===========================
  // QUERY / SEARCH LOGIC
  // ===========================
  const setQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value) params.set("query", value);
      else params.delete("query");

      params.set("page", "1");

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // ===========================
  // SORTING LOGIC
  // ===========================
  const setSorting = useCallback(
    (field: keyof T, dir: "asc" | "desc") => {
      const params = new URLSearchParams(searchParams);
      params.set("sort_by", String(field));
      params.set("sort_dir", dir);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return {
    page,
    query,
    limit,
    sort_by,
    sort_dir,

    selectedRows,
    toggleRow,
    toggleAll,

    setQuery,
    setSorting,
  };
};

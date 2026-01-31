import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React, { useMemo } from "react";
import { useCategories } from "../api/category.list";
import { Category } from "../types/catalog.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialCategory?: Partial<Category>;
  val?: string;
  onChange?: (val?: string) => void;
};
export const CategorySelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialCategory,
}: Props) => {
  const lang = i18n.language;
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebouce(query, 300);

  const categoriesQuery = useCategories({});

  const indexedItems = useMemo(() => {
    return (categoriesQuery.data?.data ?? []).map((o) => ({
      value: o.prefix,
      label: o.label,
      search: `${o.label.fr ?? ""} ${o.label.ar ?? ""}`.toLowerCase(),
    }));
  }, [categoriesQuery.data]);

  
  const options = useMemo(() => {
    if (!debouncedQuery) {
      return indexedItems.slice(0, 50);
    }

    return indexedItems
      .filter((o) => o.search.includes(debouncedQuery.toLowerCase()))
      .slice(0, 50);
  }, [indexedItems, debouncedQuery]);

  return (
    <Autocomplete<BaseOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      initialOption={{
        label: initialCategory?.label?.[lang as Lang]!,
        value: initialCategory?.prefix ?? "",
      }}
      error={error}
      items={options}
      term={query}
      setTerm={setQuery}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("procedures.pages.list.client_empty")}
      isLoading={categoriesQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? o.label : o.label[lang as Lang]
      }
    />
  );
};

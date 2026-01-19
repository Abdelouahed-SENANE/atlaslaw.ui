import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React, { useMemo } from "react";
import { useCourts } from "../api/court.list";
import { Court } from "../types/catalog.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialPrimaryCourts?: Partial<Court>;
  val?: string;
  onChange?: (val?: string) => void;
  type: string;
  parentCode?: string;
};
export const PrimaryCourtsSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialPrimaryCourts,
  type,
  parentCode,
}: Props) => {
  const lang = i18n.language;
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebouce(query, 300);

  const primeriesQuery = useCourts({
    court_type: type,
    level: "PRIMARY",
    parent_code: parentCode,
  });

  const primeries = primeriesQuery.data?.data ?? [];

  const indexedItems = useMemo(() => {
    return primeries.map((o) => ({
      value: o.code,
      label: o.label[lang as Lang] ?? "",
      search: `${o.label.fr ?? ""} ${o.label.ar ?? ""}`.toLowerCase(),
    }));
  }, [primeries]);

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
        label: initialPrimaryCourts?.code!,
        value: initialPrimaryCourts?.code ?? "",
      }}
      error={error}
      items={options}
      term={query}
      setTerm={setQuery}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("procedures.dropdown.primary_courts.empty")}
      isLoading={primeriesQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? o.label : o.label[lang as Lang]
      }
    />
  );
};

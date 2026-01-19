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
  initialAppealCourts?: Partial<Court>;
  val?: string;
  onChange?: (val?: string) => void;
  type: string;
  setAppeal?: (court: Court) => void;
};
export const AppealCourtsSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialAppealCourts,
  type,
  setAppeal,
}: Props) => {
  const lang = i18n.language;
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebouce(query, 300);

  const codeCaseQuery = useCourts({
    court_type: type,
    level: "APPEAL",
    queryConfig: {
      enabled: !!type,
    }
  }
  );

  const appeals = codeCaseQuery.data?.data ?? [];

  const indexedItems = useMemo(() => {
    return appeals.map((o) => ({
      value: o.code,
      label: o.label[lang as Lang] ?? "",
      search: `${o.label.fr ?? ""} ${o.label.ar ?? ""}`.toLowerCase(),
    }));
  }, [appeals]);

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
      onChange={(value) => {
        onChange?.(value);
        const selected = appeals.find((c) => c.code === value);
        if (selected) {
          setAppeal?.(selected);
        }
      }}
      initialOption={{
        label: initialAppealCourts?.code!,
        value: initialAppealCourts?.code ?? "",
      }}
      error={error}
      items={options}
      term={query}
      setTerm={setQuery}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("procedures.dropdown.appeal_courts.empty")}
      isLoading={codeCaseQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? o.label : o.label[lang as Lang]
      }
    />
  );
};

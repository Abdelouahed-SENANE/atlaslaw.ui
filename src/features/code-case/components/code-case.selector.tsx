import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React, { useMemo } from "react";
import { useCodeCases } from "../api/code-case.list";
import { CodeCase } from "../types/code-case.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialCodeCase?: Partial<CodeCase>;
  val?: string;
  onChange?: (val?: string) => void;
};
export const CodeCaseSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialCodeCase,
}: Props) => {
  const lang = i18n.language;
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebouce(query, 300);

  const codeCaseQuery = useCodeCases({}); 

  const indexedItems = useMemo(() => {
    return (codeCaseQuery.data?.data ?? []).map((o) => ({
      value: o.id,
      label: o.label,
      search:`${o.label.fr ?? ""} ${o.label.ar ?? ""}`.toLowerCase(),
    }));
  }, [codeCaseQuery.data]);

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
        label: initialCodeCase?.label?.[lang as Lang]!,
        value: initialCodeCase?.id ?? "",
      }}
      error={error}
      items={options}
      term={query}
      setTerm={setQuery}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("party_type.pages.list.client_empty")}
      isLoading={codeCaseQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string"
          ? o.label
          : o.label[lang as Lang]
      }
    />
  );
};

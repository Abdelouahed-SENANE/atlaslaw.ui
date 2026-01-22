import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React, { useMemo } from "react";
import { useCodes } from "../api/code.list";
import { Code } from "../types/catalog.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialCode?: Partial<Code>;
  val?: string;
  onChange?: (code?: string) => void;
  prefix: string;
  setCode?: (code: Code) => void;
};
export const CodeSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialCode,
  prefix,
  setCode,
}: Props) => {
  const lang = i18n.language;
  const [query, setQuery] = React.useState("");

  const debouncedQuery = useDebouce(query, 300);

  const codeCaseQuery = useCodes({ prefix });

  const codes = codeCaseQuery.data?.data ?? [];

  const indexedItems = useMemo(() => {
    return codes.map((o) => ({
      value: o.code,
      label: o.code,
      search: o.code,
    }));
  }, [codes]);

  const options = useMemo(() => {
    if (!debouncedQuery) {
      return indexedItems.slice(0, 30);
    }

    return indexedItems
      .filter((o) => o.search.includes(debouncedQuery.toLowerCase()))
      .slice(0, 30);
  }, [indexedItems, debouncedQuery]);

  React.useEffect(() => {
    if (!val || !codes.length) return;
    const selected = codes.find((c) => String(c.code) === String(val));
    if (selected) setCode?.(selected);
  }, [val, codes, setCode]);
  
  return (
    <Autocomplete<BaseOption>
      value={val}
      onChange={(value) => {
        onChange?.(value);
        const selected = codes.find((c) => c.code === value);
        if (selected) {
          setCode?.(selected);
        }
      }}
      initialOption={{
        label: initialCode?.code!,
        value: initialCode?.code ?? "",
      }}
      error={error}
      items={options}
      term={query}
      setTerm={setQuery}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("procedures.dropdown.codes.empty")}
      isLoading={codeCaseQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? o.label : o.label[lang as Lang]
      }
    />
  );
};

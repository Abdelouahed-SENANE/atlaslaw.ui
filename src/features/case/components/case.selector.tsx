import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { useSearchOptions } from "@/hooks/use-search-options";
import { t } from "i18next";
import React from "react";
import { getCaseOptions } from "../api/case.options";
import { CaseOption } from "../types/case.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  val?: string;
  onChange?: (val?: string) => void;
};
export const CaseSelector = ({ error, placeholder, val, onChange }: Props) => {
  const lang = i18n.language;

  const [params, setParams] = React.useState({
    query: "",
  });
  const debouncedQury = useDebouce(params.query, 600);

  const casesOptionsQuery = useSearchOptions<CaseOption>({
    fetchFn: getCaseOptions,
    term: debouncedQury,
    limit: 10,
    queryKey: ["cases:options"],
  });
  const items = React.useMemo(() => {
    return casesOptionsQuery.items.map((o: CaseOption) => ({
      label: `${o.case_ref} - ${o.client_name[lang as Lang]}`,
      value: o.id,
    }));
  }, [casesOptionsQuery.items, lang]);

  return (
    <Autocomplete<CaseOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      // initialOption={{
      //   label: initialUser?.name[lang as Lang]!,
      //   value: initialUser?.id!,
      //   email: initialUser?.email!,
      // }}
      error={error}
      items={items}
      term={params.query}
      placeholder={placeholder}
      emptyMessage={t("cases.pages.list.empty_msg")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={casesOptionsQuery.isLoading}
      renderOption={(o) => `${o.label}`}
    />
  );
};

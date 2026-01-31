import { Autocomplete } from "@/components/ui/form/autocomplete";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { useSearchOptions } from "@/hooks/use-search-options";
import { t } from "i18next";
import React, { useMemo } from "react";
import { getProcedureOptions } from "../api/procedure.options";
import { ProcedureOption } from "../types/case.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  val?: string;
  onChange?: (val?: string) => void;
  caseId?: string;
};
export const ProcedureSelector = ({
  error,
  placeholder,
  val,
  onChange,
  caseId,
}: Props) => {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouce(query, 600);

  const proceduresOptionsQuery = useSearchOptions<
    ProcedureOption,
    { caseId: string }
  >({
    fetchFn: getProcedureOptions,
    limit: 10,
    params: caseId ? { caseId } : undefined,
    queryKey: ["procedures:options", caseId],
    enabled: !!caseId,
  });
  const procedures = proceduresOptionsQuery.items;
  const items = React.useMemo(() => {
    return procedures.map((o: ProcedureOption) => ({
      label: `${o.number}/${o.code}/${o.year}`,
      value: o.id,
      search: `${o.number}/${o.code}/${o.year}`,
    }));
  }, [procedures]);

  const options = useMemo(() => {
    if (!debouncedQuery) {
      return items.slice(0, 30);
    }

    return items.filter((o: ProcedureOption) =>
      o.search.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [procedures, debouncedQuery]);

  const handleChange = React.useCallback(
    (value?: string) => onChange?.(value),
    [onChange],
  );

  const renderOption = React.useCallback(
    (o: ProcedureOption) => `${o.label}`,
    [],
  );

  return (
    <Autocomplete<ProcedureOption>
      value={val}
      onChange={handleChange}
      // initialOption={{
      //   label: initialUser?.name[lang as Lang]!,
      //   value: initialUser?.id!,
      //   email: initialUser?.email!,
      // }}
      error={error}
      items={options}
      term={query}
      placeholder={placeholder}
      emptyMessage={t("procedures.pages.list.empty_msg")}
      setTerm={(q) => setQuery(q)}
      isLoading={proceduresOptionsQuery.isLoading}
      renderOption={renderOption}
    />
  );
};

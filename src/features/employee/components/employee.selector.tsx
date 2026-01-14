import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { useSearchOptions } from "@/hooks/use-search-options";
import { t } from "i18next";
import React from "react";
import { Employee } from "../types";
import { getEmployeeOptions } from "../api/list-options-employee";


type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialEmployee?: Partial<Employee>;
  val?: string;
  onChange?: (val?: string) => void;
};
export const EmployeeSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialEmployee,
}: Props) => {
  const lang = i18n.language;
  const [params, setParams] = React.useState({
    query: "",
    limit: 10,
  });
  const debouncedQury = useDebouce(params.query, 600);

  const employeeItemQuery = useSearchOptions<BaseOption>({
    fetchFn: getEmployeeOptions,
    term: debouncedQury,
    limit: params.limit,
    queryKey: "employees:options",
  });
  
  
  return (
    <Autocomplete<BaseOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      initialOption={{
        label: initialEmployee?.user?.name?.[lang as Lang]!,
        value: initialEmployee?.id ?? "",
      }}
      error={error}
      items={employeeItemQuery.items as BaseOption[]}
      term={params.query}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("party_type.pages.list.employee_empty")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={employeeItemQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? `${o.label}` : `${o.label[lang as Lang]}`
      }
    />
  );
};

import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { useSearchOptions } from "@/hooks/use-search-options";
import { t } from "i18next";
import React from "react";
import { getClientOptions } from "../api/list-options-client";
import { ClientView } from "../types/client.type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialClient?: Partial<ClientView>;
  val?: string;
  renderFooter?: () => React.ReactNode;
  onChange?: (val?: string) => void;
};
export const ClientSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialClient,
  renderFooter,
}: Props) => {
  const lang = i18n.language;
  const [params, setParams] = React.useState({
    query: "",
    limit: 10,
  });
  const debouncedQury = useDebouce(params.query, 600);

  const clientItemQuery = useSearchOptions<BaseOption>({
    fetchFn: getClientOptions,
    term: debouncedQury,
    limit: params.limit,
    queryKey:["clients:options"],
  });

  return (
    <Autocomplete<BaseOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      initialOption={{
        label: initialClient?.name?.[lang as Lang]!,
        value: initialClient?.id ?? "",
      }}
      error={error}
      items={clientItemQuery.items as BaseOption[]}
      term={params.query}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("party_type.pages.list.client_empty")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={clientItemQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? `${o.label}` : `${o.label[lang as Lang]}`
      }
      renderFooter={renderFooter}
    />
  );
};

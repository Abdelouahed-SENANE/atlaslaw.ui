import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { useInfiniteOptions } from "@/hooks/use-infinite-options";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
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
  onChange?: (val?: string) => void;
};
export const ClientSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialClient,
}: Props) => {
  const lang = i18n.language;
  const [params, setParams] = React.useState({
    query: "",
    limit: 10,
  });
  const debouncedQury = useDebouce(params.query, 600);

  const partyTypesOptionsQuery = useInfiniteOptions<BaseOption>({
    fetchFn: getClientOptions,
    term: debouncedQury,
    limit: params.limit,
    queryKey: "clients:options",
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
      items={partyTypesOptionsQuery.items as BaseOption[]}
      term={params.query}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("party_type.pages.list.client_empty")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={partyTypesOptionsQuery.isLoading}
      isFetchingNextPage={partyTypesOptionsQuery.isFetchingNextPage}
      hasNextPage={partyTypesOptionsQuery.hasNextPage}
      onLoadMore={partyTypesOptionsQuery.fetchNextPage}
      renderOption={(o) =>
        typeof o.label === "string" ? `${o.label}` : `${o.label[lang as Lang]}`
      }
    />
  );
};

import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { useInfiniteOptions } from "@/hooks/use-infinite-options";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React from "react";
import { getPartyTypeOptions } from "../api/party-type.options";
import { PartyType, PartyTypeOption } from "../types/party-type";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialPartyType?: Partial<PartyType>;
  val?: string;
  onChange?: (val?: string, option?: PartyTypeOption) => void;
};
export const PartyTypeSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialPartyType,
}: Props) => {
  const lang = i18n.language;

  const [params, setParams] = React.useState({
    query: "",
    limit: 10,
  });
  const debouncedQury = useDebouce(params.query, 600);

  const partyTypesOptionsQuery = useInfiniteOptions<BaseOption>({
    fetchFn: getPartyTypeOptions,
    term: debouncedQury,
    limit: params.limit,
    queryKey: "party-types:options",
  });



  return (
    <Autocomplete<PartyTypeOption>
      value={val}
      onChange={(value, option) => onChange?.(value, option)}
      initialOption={{
        label: initialPartyType?.name?.[lang as Lang]!,
        value: initialPartyType?.id!,
        support_legal_identifiers: initialPartyType?.support_legal_identifiers!,
      }}
      error={error}
      items={partyTypesOptionsQuery.items as PartyTypeOption[]}
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

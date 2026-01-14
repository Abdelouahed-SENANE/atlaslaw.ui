import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { BaseOption, Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { useSearchOptions } from "@/hooks/use-search-options";
import { t } from "i18next";
import React from "react";
import { OpponentView } from "../types/opponent.type";
import { getOpponentOptions } from "../api/list-options-opponent";


type Props = {
  error?: FieldError | string;
  placeholder?: string;
  searchPlaceholder?: string;
  initialOpponent?: Partial<OpponentView>;
  val?: string;
  onChange?: (val?: string) => void;
  renderFooter?: () => React.ReactNode;
};
export const OpponentSelector = ({
  error,
  placeholder,
  searchPlaceholder,
  onChange,
  val,
  initialOpponent,
  renderFooter,
}: Props) => {
  const lang = i18n.language;
  const [params, setParams] = React.useState({
    query: "",
  });
  const debouncedQury = useDebouce(params.query, 600);

  const oppnentItemQuery = useSearchOptions<BaseOption>({
    fetchFn: getOpponentOptions,
    term: debouncedQury,
    queryKey: "opponents:options",
  });

  return (
    <Autocomplete<BaseOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      initialOption={{
        label: initialOpponent?.name?.[lang as Lang]!,
        value: initialOpponent?.id ?? "",
      }}
      error={error}
      items={oppnentItemQuery.items as BaseOption[]}
      term={params.query}
      searchPlaceholder={searchPlaceholder}
      placeholder={placeholder}
      emptyMessage={t("party_type.pages.list.oppnent_empty")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={oppnentItemQuery.isLoading}
      renderOption={(o) =>
        typeof o.label === "string" ? `${o.label}` : `${o.label[lang as Lang]}`
      }
      renderFooter={renderFooter}
    />
  );
};

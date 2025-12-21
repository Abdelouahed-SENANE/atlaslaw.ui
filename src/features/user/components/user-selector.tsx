import { Autocomplete } from "@/components/ui/form/autocomplete";
import i18n from "@/config/i18n";
import { useInfiniteOptions } from "@/hooks/use-infinite-options";
import { Lang } from "@/types/api";
import { FieldError } from "react-hook-form";

import { useDebouce } from "@/hooks/use-debounce";
import { t } from "i18next";
import React from "react";
import { getUsersOptions } from "../api/search-available-users";
import { User, UserOption } from "../types";

type Props = {
  error?: FieldError | string;
  placeholder?: string;
  initialUser?: User;
  val?: string;
  onChange?: (val?: string) => void;
};
export const UserSelect = ({
  error,
  placeholder,
  val,
  onChange,
  initialUser,
}: Props) => {
  const lang = i18n.language;

  const [params, setParams] = React.useState({
    query: "",
    limit: 10,
  });
  const debouncedQury = useDebouce(params.query, 600);

  const usersOptionsQuery = useInfiniteOptions<UserOption>({
    fetchFn: getUsersOptions,
    term: debouncedQury,
    limit: params.limit,
  });

  console.log("intialUser", initialUser);
  return (
    <Autocomplete<UserOption>
      value={val}
      onChange={(value) => onChange?.(value)}
      initialOption={{
        label: initialUser?.name[lang as Lang]!,
        value: initialUser?.id!,
        email: initialUser?.email!,
      }}
      error={error}
      items={usersOptionsQuery.items as UserOption[]}
      term={params.query}
      placeholder={placeholder}
      emptyMessage={t("users.pages.list.empty_msg")}
      setTerm={(q) => setParams((p) => ({ ...p, query: q }))}
      isLoading={usersOptionsQuery.isLoading}
      isFetchingNextPage={usersOptionsQuery.isFetchingNextPage}
      hasNextPage={usersOptionsQuery.hasNextPage}
      onLoadMore={usersOptionsQuery.fetchNextPage}
      renderOption={(o) =>
        typeof o.label === "string"
          ? `${o.label} - ${o.email}`
          : `${o.label[lang as Lang]} - ${o.email}`
      }
    />
  );
};

import { MultiAutocomplete } from "@/components/ui/form/multi-autocomplete";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCourtsOptions } from "../api/court.options";

type Props = {
  value?: string[];
  onChange: (value: string[]) => void;
};
export const CourtsMultiSelector = ({ value = [], onChange }: Props) => {
  const [term, setTerm] = useState<string>("");
  const courtOptionsQuery = useCourtsOptions({});
  const { t } = useTranslation();
  const memoItems = React.useMemo(() => {
    return courtOptionsQuery.data?.data?.map((o) => ({
      value: o.value,
      label: o.label ?? "",
      search:
        typeof o.label === "string"
          ? o.label
          : `${o.label.fr ?? ""} ${o.label.ar ?? ""}`.toLowerCase(),
    }));
  }, [courtOptionsQuery.data?.data]);

  const options = React.useMemo(() => {
    if (!term) {
      return memoItems?.slice(0, 30);
    }

    return memoItems
      ?.filter((o) => o.search.includes(term.toLowerCase()))
      .slice(0, 30);
  }, [term, memoItems]);

  return (
    <MultiAutocomplete
      placeholder={t("fields.courts.placeholder")}
      setTerm={setTerm}
      term={term}
      label="Courts"
      items={options ?? []}
      value={value}
      onChange={(value) => onChange(value)}
    />
  );
};

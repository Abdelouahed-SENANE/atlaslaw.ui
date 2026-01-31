"use client";

import { Button } from "@/components/ui/button";
import { useCategories } from "@/features/catalog/api/category.list";
import { useCourtsOptions } from "@/features/catalog/api/court.options";
import { formatDateOnly, formatDateTime } from "@/lib/utils";
import { Lang } from "@/types/api";
import { Calendar, Clock, Folder, Gavel, X } from "lucide-react";
import React from "react";
import { HearingCriteria } from "../types/case.type";

type ChipProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  onRemove: () => void;
};

function FilterChip({ icon, label, value, onRemove }: ChipProps) {
  return (
    <div className="text-sm bg-primary/10 text-primary flex items-center gap-2 rounded-sm px-2 py-1">
      <span className="font-medium flex items-center gap-1">
        {icon}
        {label}:
      </span>
      <span>{value}</span>
      <button onClick={onRemove}>
        <X className="size-4" />
      </button>
    </div>
  );
}

type Props = {
  criteria: HearingCriteria;
  lang: Lang;
  t: (key: string) => string;

  onChange: (next: HearingCriteria) => void;
  resolveCategoryLabel?: (id: string) => string | undefined;
  resolveCourtLabels?: (ids: string[]) => string[];
};
export function HearingActiveFilters({ criteria, lang, t, onChange }: Props) {
  const hasActiveFilters = Object.values(criteria).some(
    (v) =>
      v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0),
  );

  if (!hasActiveFilters) return null;
  const categoriesQuery = useCategories({});
  const courtsQuery = useCourtsOptions({});

  const categoryMap = React.useMemo(() => {
    return new Map(
      (categoriesQuery.data?.data ?? []).map((c) => [c.prefix, c.label]),
    );
  }, [categoriesQuery.data]);

  const courtMap = React.useMemo(() => {
    return new Map(
      (courtsQuery.data?.data ?? []).map((c) => [c.value, c.label]),
    );
  }, [courtsQuery.data]);

  return (
    <div className="border border-border p-4 rounded-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">{t("global.filters.active")}</h4>

        <Button
          variant="outline"
          className="px-2 text-sm"
          onClick={() => onChange({})}
        >
          <X className="size-4 mr-1" />
          {t("global.filters.clear_all")}
        </Button>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {/* Hearing date */}
        {criteria.hearing_date && (
          <FilterChip
            icon={<Calendar className="size-4" />}
            label={t("hearings.fields.hearing_date.label")}
            value={formatDateOnly(
              criteria.hearing_date,
              lang,
            )}
            onRemove={() =>
              onChange({
                ...criteria,
                hearing_date: undefined,
              })
            }
          />
        )}

        {/* Next hearing */}
        {criteria.next_hearing_at && (
          <FilterChip
            icon={<Clock className="size-4" />}
            label={t("hearings.fields.next_hearing_at.label")}
            value={formatDateTime(
              criteria.next_hearing_at,
              lang,
            )}
            onRemove={() =>
              onChange({
                ...criteria,
                next_hearing_at: undefined,
              })
            }
          />
        )}

        {/* Category */}
        {criteria.category_id && (
          <FilterChip
            icon={<Folder className="size-4" />}
            label={t("cases.fields.category_id.label")}
            value={
              categoryMap.get(criteria.category_id!)?.[lang] ??
              criteria.category_id
            }
            onRemove={() =>
              onChange({
                ...criteria,
                category_id: undefined,
              })
            }
          />
        )}

        {/* Courts */}
        {criteria.court_ids && criteria.court_ids.length > 0 && (
          <FilterChip
            icon={<Gavel className="size-4" />}
            label={t("hearings.filter.courts")}
            value={criteria.court_ids
              .map((id) => {
                const court = courtMap.get(id);
                return typeof court === "string"
                  ? court
                  : (court?.[lang] ?? id);
              })
              .join(", ")}
            onRemove={() =>
              onChange({
                ...criteria,
                court_ids: undefined,
              })
            }
          />
        )}
      </div>
    </div>
  );
}

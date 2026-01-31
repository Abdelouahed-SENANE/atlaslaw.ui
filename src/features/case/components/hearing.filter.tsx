import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { DateInput } from "@/components/ui/form/date-input";

import { InputDateTime } from "@/components/ui/form/input-datetime";
import { CategorySelector } from "@/features/catalog/components/categories.selector";
import { CourtsMultiSelector } from "@/features/catalog/components/courts.multi-selector";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HearingCriteria } from "../types/case.type";

const EMPTY: HearingCriteria = {
  hearing_date: undefined,
  next_hearing_at: undefined,
  category_id: undefined,
  court_ids: undefined,
};
type Props = {
  criteria: HearingCriteria;
  onCriteriaChange: (filter: HearingCriteria) => void;
};
export const HearingFilter = ({ criteria, onCriteriaChange }: Props) => {
  const { t } = useTranslation();
  const [internal, setInternal] = useState<HearingCriteria>(criteria);
  const { isOpen, open, close } = useDisclosure();
  const handleOnChange = () => {
    onCriteriaChange(internal);
  };
  const handleReset = () => {
    setInternal(EMPTY);
    onCriteriaChange(EMPTY);
  };
  useEffect(() => {
    setInternal(criteria);
  }, [criteria]);

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      onOpenChange={(v) => (v ? open() : close())}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          {t("global.actions.trigger_filter")}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-200 bg-card border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2 w-full border-b border-border">
          <h4 className="text-base  py-3 px-2 font-semibold">
            Recherche avancée
          </h4>
          <Button onClick={() => close()} variant="plain">
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-4 px-4">
          <div>
            <label
              htmlFor="hearing_date"
              className="text-lg font-bold text-card-foreground"
            >
              {t("hearings.fields.hearing_date.label")}
            </label>

                <DateInput
                  label={t("hearings.fields.hearing_date.label")}
                  placeholder={t("hearings.fields.hearing_date.placeholder")}
                  val={internal.hearing_date}
                  onChange={(val) =>
                    setInternal({ ...internal, hearing_date: val })
                  }
                />
            
          </div>
          <div>
            <label className="text-lg font-bold text-card-foreground">
              {t("hearings.fields.next_hearing_at.label")}
            </label>
                <InputDateTime
                  label={t("hearings.fields.next_hearing_at.label")}
                  placeholder={t("hearings.fields.next_hearing_at.placeholder")}
                  value={internal.next_hearing_at}
                  onChange={(val) =>
                    setInternal({ ...internal, next_hearing_at: val })
                  }
                />              
          </div>
          <div>
            <label className="text-lg font-bold text-card-foreground">
              {t("cases.fields.category_id.label")}
            </label>
            <CategorySelector
              placeholder={t("cases.fields.category_id.placeholder")}
              val={internal.category_id}
              onChange={(val) => setInternal({ ...internal, category_id: val })}
            />
          </div>
          <div>
            <label className="text-lg font-bold text-card-foreground">
              {t("hearings.filter.courts")}
            </label>
            <CourtsMultiSelector
              value={internal.court_ids}
              onChange={(val) => setInternal({ ...internal, court_ids: val })}
            />
          </div>
        </div>
        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
          <Button onClick={handleReset} variant="outline">
            {t("hearings.filter.reset")}
          </Button>
          <Button
            onClick={() => {
              handleOnChange();
              setTimeout(() => close(), 50);
            }}
          >
            {t("hearings.filter.apply")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

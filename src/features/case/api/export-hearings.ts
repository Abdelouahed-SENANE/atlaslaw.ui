import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { toDateOnly, toDateTime } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { HearingCriteria } from "../types/case.type";

const exportHearings = async (hearingFilter: HearingCriteria) => {
  const res = await api$.get(`/exports/hearings/pdf`, {
    responseType: "blob",
    params: {
      hearing_date: toDateOnly(hearingFilter.hearing_date),
      next_hearing_at: toDateTime(hearingFilter.next_hearing_at),
      category_id: hearingFilter.category_id,
      court_ids: hearingFilter.court_ids,
    },
  });
  return res;
};
export const useExportHearings = ({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof exportHearings>}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: exportHearings,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

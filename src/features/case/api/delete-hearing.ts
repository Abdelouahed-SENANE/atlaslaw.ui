import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HEARINGS_KEY } from "./list-hearings";

export const deleteHearing = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/hearings/${id}`);
};

type UseDeleteHearingOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof deleteHearing>;
};

export const useDeleteHearing = ({
  mutationConfig,
}: UseDeleteHearingOptions) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteHearing,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [HEARINGS_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

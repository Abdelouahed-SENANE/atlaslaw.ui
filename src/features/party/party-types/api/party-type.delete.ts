import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PARTY_TYPES_KEY } from "./list-party-types";

export const deletePartyType = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/parties/types/${id}`);
};

type UseDeletePartyTypeOptions = {
  mutationConfig?: MutationConfig<typeof deletePartyType>;
};

export const useDeletePartyType = ({
  mutationConfig,
}: UseDeletePartyTypeOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deletePartyType,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PARTY_TYPES_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

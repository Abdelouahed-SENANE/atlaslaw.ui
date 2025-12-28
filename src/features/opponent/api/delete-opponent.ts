import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OPPONENTS_KEY } from "./list-opponent";

export const deleteOpponent = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/opponents/${id}`);
};

type UseDeleteOpponentOptions = {
  mutationConfig?: MutationConfig<typeof deleteOpponent>;
};

export const useDeleteOpponent = ({
  mutationConfig,
}: UseDeleteOpponentOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteOpponent,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [OPPONENTS_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

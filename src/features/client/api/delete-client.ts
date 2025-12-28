import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLIENTS_KEY } from "./list-client";

export const deleteClient = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/clients/${id}`);
};

type UseDeleteClientOptions = {
  mutationConfig?: MutationConfig<typeof deleteClient>;
};

export const useDeleteClient = ({
  mutationConfig,
}: UseDeleteClientOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ROLES_KEY } from "./get-roles";

export const deleteRole = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/roles/${id}`);
};

type UseDeleteRoleOptions = {
  mutationConfig?: MutationConfig<typeof deleteRole>;
};

export const useDeleteRole = ({
  mutationConfig,
}: UseDeleteRoleOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [ROLES_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

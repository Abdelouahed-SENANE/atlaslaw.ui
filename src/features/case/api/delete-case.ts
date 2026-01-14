import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CASE_KEY } from "./case-details";
import { CASES_KEY } from "./list-case";

export const deleteCase = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/cases/${id}`);
};

type UseDeleteCaseOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof deleteCase>;
};

export const useDeleteCase = ({ id, mutationConfig }: UseDeleteCaseOptions) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteCase,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CASES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [CASE_KEY, id], exact: true });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

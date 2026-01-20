import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PROCEDURES_KEY } from "./list-procedures";
import { PROCEDURE_FORM_QK } from "./procedure.edit.query";


export const deleteProcedure = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/cases/procedures/${id}`);
};

type UseDeleteProcedureOptions = {
  id: string;
  mutationConfig?: MutationConfig<typeof deleteProcedure>;
};

export const useDeleteProcedure = ({id , mutationConfig }: UseDeleteProcedureOptions) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteProcedure,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PROCEDURES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [PROCEDURE_FORM_QK, id], exact: true });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

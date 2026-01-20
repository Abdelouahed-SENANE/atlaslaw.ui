import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { createProcedureSchema } from "./create-procedure";
import { PROCEDURES_KEY } from "./list-procedures";
import { PROCEDURE_FORM_QK } from "./procedure.edit.query";

export const updateProcedureSchema = createProcedureSchema.partial();
export type UpdateProcedureInputs = z.infer<typeof updateProcedureSchema>;

const updateProcedure = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateProcedureInputs;
}) => {
  return api$.put(`/cases/procedures/${id}`, payload);
};

export const useUpdateProcedure = ({
  id,
  mutationConfig,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateProcedure>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateProcedure,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PROCEDURES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [PROCEDURE_FORM_QK, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

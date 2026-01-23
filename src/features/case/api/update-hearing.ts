import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HearingFormInputs } from "../components/hearing.form";
import { HEARINGS_KEY } from "./list-hearings";



const updateHearing = ({
  id,
  payload,
}: {
  id: string;
  payload: HearingFormInputs;
}) => {
  return api$.put(`/hearings/${id}`, payload);
};

export const useUpdateHearing = ({
  mutationConfig,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateHearing>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateHearing,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [HEARINGS_KEY], exact: false });
      // qc.invalidateQueries({ queryKey: [PROCEDURE_FORM_QK, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

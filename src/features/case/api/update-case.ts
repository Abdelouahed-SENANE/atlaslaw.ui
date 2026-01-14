import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CaseFormInputs } from "../components/case.form";
import { createCaseSchema } from "./create-case";
import { CASES_KEY } from "./list-case";
import { CASE_KEY } from "./case-details";

export const updateCaseSchema = createCaseSchema.partial();

const updateCase = ({
  id,
  payload,
}: {
  id: string;
  payload: CaseFormInputs;
}) => {
  return api$.put(`/cases/${id}`, payload);
};

export const useUpdateCase = ({
  id,
  mutationConfig,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateCase>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateCase,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CASES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [CASE_KEY , id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

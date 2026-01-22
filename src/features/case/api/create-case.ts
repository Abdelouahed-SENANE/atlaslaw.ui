import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { CASES_KEY } from "./list-case";
import { CaseFormInputs } from "../components/case.form";

export const createCaseSchema = z.object({
  case_ref: z.string().min(1, "cases.fields.case_ref.errors.required"),
  client_id: z.string().min(1, "cases.fields.client_id.errors.required"),
  opponent_id: z.string().min(1, "cases.fields.opponent_id.errors.required"),
  category_id: z.string().min(1, "cases.fields.category_id.errors.required"),
  opening_date: z.coerce.date({
    error: "cases.fields.opening_date.errors.invalid",
  }),
  case_manager_id: z
    .string()
    .min(1, "cases.fields.case_manager_id.errors.required"),
  note: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
});

export type CreateCaseInputs = z.infer<typeof createCaseSchema>;

const createCase = ({ payload }: { payload: CaseFormInputs }) => {
  return api$.post("/cases", payload);
};

export const useCreateCase = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createCase>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createCase,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CASES_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

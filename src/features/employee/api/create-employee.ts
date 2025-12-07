import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { normalizeToE164 } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { EMPLOYEES_KEY } from "./list-employees";

export const createEmployeeSchema = z.object({
  user_id: z
    .string("user.email.errors.invalid")
    .min(1, "user.email.errors.required"),
  job_title: z.string().min(1, "employees.fields.job_title.errors.required"),
  hiring_date: z.date("employees.fields.hiring_date.errors.invalid"),
  status: z.enum(
    ["active", "inactive"],
    "employees.fields.status.errors.required"
  ),
  work_phone: z
    .string()
    .optional()
    .transform((value) => normalizeToE164(value || "", "+212"))
    .refine(
      (value) => !value || /^\+[1-9]\d{7,14}$/.test(value),
      "employees.fields.work_phone.errors.invalid"
    ),
});

export type CreateEmployeeInputs = z.infer<typeof createEmployeeSchema>;

const createEmployee = ({ payload }: { payload: CreateEmployeeInputs }) => {
  return api$.post("/employees", payload);
};

export const useCreateEmployee = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createEmployee>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: ["options"], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

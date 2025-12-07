import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { normalizeToE164 } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { EMPLOYEE_KEY } from "./employee-details";
import { EMPLOYEES_KEY } from "./list-employees";

export const updateEmployeeSchema = z.object({
  job_title: z
    .string()
    .min(1, "employees.fields.job_title.errors.required")
    .optional(),
  hiring_date: z.preprocess((val) => {
    if (!val) return undefined;

    // Already a Date
    if (val instanceof Date) return val;

    // Convert string → Date
    const parsed = new Date(val as string);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, z.date("employees.fields.hiring_date.errors.invalid").optional()),
  status: z
    .enum(["active", "inactive"], "employees.fields.status.errors.required")
    .optional(),
  work_phone: z
    .string()
    .optional()
    .transform((value) => normalizeToE164(value || "", "+212"))
    .refine(
      (value) => !value || /^\+[1-9]\d{7,14}$/.test(value),
      "employees.fields.work_phone.errors.invalid"
    )
    .optional(),
});
export type UpdateEmployeeInputs = z.infer<typeof updateEmployeeSchema>;

const updateEmployee = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<UpdateEmployeeInputs>;
}) => {
  return api$.put(`/employees/${id}`, payload);
};

export const useUpdateEmployee = ({
  mutationConfig,
  id,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateEmployee>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [EMPLOYEE_KEY, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { PROCEDURES_KEY } from "./list-procedures";

export const createProcedureSchema = z.object({
  number: z.coerce
    .number({
      error: "procedures.fields.number.errors.invalid",
    })
    .min(1, "procedures.fields.number.errors.required"),

  code: z.coerce
    .number({
      error: "procedures.fields.code.errors.invalid",
    })
    .min(1, "procedures.fields.code.errors.required"),

  year: z.coerce
    .number({
      error: "procedures.fields.year.errors.invalid",
    })
    .int("procedures.fields.year.errors.invalid")
    .min(2010, "procedures.fields.year.errors.range")
    .max(new Date().getFullYear(), "procedures.fields.year.errors.range"),

  procedure_date: z.preprocess(
    (val) => {
      if (val instanceof Date) {
        return val.toISOString().slice(0, 10); // YYYY-MM-DD
      }
      return val;
    },
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "procedures.fields.procedure_date.errors.invalid",
    }),
  ),
  criteria: z.enum(["plaintiff", "defendant"], {
    error: "procedures.fields.criteria.errors.required",
  }),

  court_appeal: z
    .string()
    .min(1, "procedures.fields.court_appeal.errors.required"),
  court_primary: z.string().optional(),
  note: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
});

export type CreateProcedureInputs = z.infer<typeof createProcedureSchema>;
export const updateProcedureSchema = createProcedureSchema.partial();
export type UpdateProcedureInputs = z.infer<typeof updateProcedureSchema>;

export const createProcedure = ({
  caseId,
  payload,
}: {
  caseId: string;
  payload: CreateProcedureInputs;
}) => {
  return api$.post(`/cases/${caseId}/procedures`, payload);
};

export const useCreateProcedure = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createProcedure>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createProcedure,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PROCEDURES_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

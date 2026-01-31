import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { HearingFormInputs } from "../components/hearing.form";
import { HEARINGS_KEY } from "./list-hearings";

export const requiredDate = (requiredMsg: string, invalidMsg: string) =>
  z.any().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({
        code: "custom",
        message: requiredMsg,
      });
      return;
    }

    if (!(val instanceof Date) || isNaN(val.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: invalidMsg,
      });
    }
  });

export const createHearingSchema = z.object({
  procedure_id: z
    .string({ error: "hearings.fields.procedure.errors.required" })
    .min(1, "cases.fields.procedure.errors.required"),
  hearing_date: requiredDate(
    "hearings.fields.hearing_date.errors.required",
    "hearings.fields.hearing_date.errors.invalid",
  ),

  next_hearing_at: requiredDate(
    "hearings.fields.hearing_date.errors.required",
    "hearings.fields.hearing_date.errors.invalid",
  ),
  hearing_type: z
    .string()
    .min(1, "hearings.fields.hearing_type.errors.required"),
  judge_name: z.string().optional().nullable(),
  room_number: z.string().optional().nullable(),
  note: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable()
    .optional(),
});

export type CreateHearingInputs = z.infer<typeof createHearingSchema>;
export const updateHearingSchema = createHearingSchema.partial();
export type UpdateHearingInputs = z.infer<typeof updateHearingSchema>;

export const createHearing = ({ payload }: { payload: HearingFormInputs }) => {
  return api$.post(`/hearings`, payload);
};

export const useCreateHearing = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createHearing>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createHearing,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [HEARINGS_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

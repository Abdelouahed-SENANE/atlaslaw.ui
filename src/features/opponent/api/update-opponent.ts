import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";

import { createTranslationSchema } from "@/lib/auth";
import { createContactSchema, createLegalProfileSchema } from "@/types/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { OPPONENTS_KEY } from "./list-opponent";
import { OPPONENT_DETAILS_EDIT_KEY } from "./opponent-details-edit";


export const updateOpponentSchema = z
  .object({
    name: createTranslationSchema("opponents.fields.name.errors").optional(),
    opponent_type_id: z
      .string()
      .min(1, "opponents.fields.opponent_type.errors.required")
      .optional(),
    national_id: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    contact: createContactSchema.optional(),
    legal_profile: createLegalProfileSchema.optional(),
  })
  .strict();

export type UpdateOpponentInputs = z.infer<typeof updateOpponentSchema>;

const UpdateOpponent = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateOpponentInputs;
}) => {
  return api$.put(`/opponents/${id}`, payload);
};

export const useUpdateOpponent = ({
  id,
  mutationConfig,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof UpdateOpponent>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: UpdateOpponent,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [OPPONENTS_KEY], exact: false });
      qc.invalidateQueries({
        queryKey: [OPPONENT_DETAILS_EDIT_KEY, id],
        exact: true,
      });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

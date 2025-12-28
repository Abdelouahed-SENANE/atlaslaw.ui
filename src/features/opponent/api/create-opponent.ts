import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";

import { createTranslationSchema } from "@/lib/auth";
import { createContactSchema, createLegalProfileSchema } from "@/types/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { OPPONENTS_KEY } from "./list-opponent";

export const createOpponentSchema = z.object({
  name: createTranslationSchema("opponents.fields.name.errors"),
  opponent_type_id: z.string().min(1, "opponents.fields.opponent_type.errors.required"),
  national_id: z.string().optional(),
  notes: z.string().optional(),
  contact: createContactSchema,
  legal_profile: createLegalProfileSchema.optional(),
});

export type CreateOpponentInputs = z.infer<typeof createOpponentSchema>;

const createOpponent = ({ payload }: { payload: CreateOpponentInputs }) => {
  return api$.post("/opponents", payload);
};

export const useCreateOpponent = ({

  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createOpponent>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createOpponent,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [OPPONENTS_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

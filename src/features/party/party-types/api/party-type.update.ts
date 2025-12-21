import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { createTranslationSchema } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { PARTY_TYPE_KEY } from "./party-type.details";
import { PARTY_TYPES_KEY } from "./list-party-types";

export const updatePartyTypeSchema = z.object({
  name: createTranslationSchema("party_types.fields.name.errors").optional(),
  description: createTranslationSchema(
    "party_types.fields.description.errors"
  ).optional(),
  is_active: z
    .boolean("party_types.fields.is_active.errors.required")
    .optional(),
  support_legal_identifiers: z
    .boolean("party_types.fields.support_legal_identifiers.errors.required")
    .optional(),
});

export type UpdatePartyTypeInputs = z.infer<typeof updatePartyTypeSchema>;

const createPartyType = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdatePartyTypeInputs;
}) => {
  return api$.put(`/partys/types/${id}`, payload);
};

export const useUpdatePartyType = ({
  mutationConfig,
  id,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof createPartyType>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createPartyType,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PARTY_TYPES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [PARTY_TYPE_KEY, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

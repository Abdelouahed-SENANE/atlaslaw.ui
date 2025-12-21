import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { createTranslationSchema } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { PARTY_TYPES_KEY } from "./list-party-types";

export const createPartyTypeSchema = z.object({
  name: createTranslationSchema("client_types.fields.name.errors"),
  description: createTranslationSchema(
    "client_types.fields.description.errors"
  ),
  is_active: z.boolean("client_types.fields.is_active.errors.required"),
  support_legal_identifiers: z.boolean(
    "client_types.fields.support_legal_identifiers.errors.required"
  ),
});

export type CreatePartyTypeInputs = z.infer<typeof createPartyTypeSchema>;

const createPartyType = ({ payload }: { payload: CreatePartyTypeInputs }) => {
  return api$.post("/parties/types", payload);
};

export const useCreatePartyType = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createPartyType>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createPartyType,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [PARTY_TYPES_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

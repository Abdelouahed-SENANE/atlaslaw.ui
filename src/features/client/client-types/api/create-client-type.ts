import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { createTranslationSchema } from "@/lib/auth";
import { normalizeToE164 } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { CLIENT_TYPES_KEY } from "./list-client-types";

export const createClientTypeSchema = z.object({
  name: createTranslationSchema("client_types.fields.name.errors"),
  description: createTranslationSchema("client_types.fields.description.errors"),
  is_active: z.boolean("client_types.fields.is_active.errors.required"),
  support_legal_identifiers : z.boolean("client_types.fields.support_legal_identifiers.errors.required"),
});

export type CreateClientTypeInputs = z.infer<typeof createClientTypeSchema>;

const createClientType = ({ payload }: { payload: CreateClientTypeInputs }) => {
  return api$.post("/clients/types", payload);
};

export const useCreateClientType = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createClientType>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createClientType,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CLIENT_TYPES_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

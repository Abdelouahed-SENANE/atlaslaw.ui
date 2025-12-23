import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";

import { createTranslationSchema } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { CLIENTS_KEY } from "./list-client";
import { createContactSchema, createLegalProfileSchema } from "@/types/schemas";

export const createClientSchema = z.object({
  name: createTranslationSchema("clients.fields.name.errors"),
  party_type_id: z.string().min(1, "clients.fields.party_type.errors.required"),
  parent_id: z.string().optional(),
  national_id: z.string().optional(),
  notes: z.string().optional(),
  contact: createContactSchema,
  legal_profile: createLegalProfileSchema,
});

export type CreateClientInputs = z.infer<typeof createClientSchema>;

const createClient = ({ payload }: { payload: CreateClientInputs }) => {
  return api$.post("/clients", payload);
};

export const useCreateClient = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createClient>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createClient,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

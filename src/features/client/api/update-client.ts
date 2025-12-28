import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";

import { createTranslationSchema } from "@/lib/auth";
import { createContactSchema, createLegalProfileSchema } from "@/types/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { CLIENT_DETAILS_EDIT_KEY } from "./client-details-edit";
import { CLIENTS_KEY } from "./list-client";

export const updateClientSchema = z
  .object({
    name: createTranslationSchema("clients.fields.name.errors").optional(),

    client_type_id: z
      .string()
      .min(1, "clients.fields.client_type.errors.required")
      .optional(),

    parent_id: z.string().optional().nullable(),

    national_id: z.string().optional().nullable(),

    notes: z.string().optional().nullable(),

    contact: createContactSchema.optional(),

    legal_profile: createLegalProfileSchema.optional(),
  })
  .strict();

export type UpdateClientInputs = z.infer<typeof updateClientSchema>;

const UpdateClient = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateClientInputs;
}) => {
  return api$.put(`/clients/${id}`, payload);
};

export const useUpdateClient = ({
  id,
  mutationConfig,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof UpdateClient>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: UpdateClient,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [CLIENTS_KEY], exact: false });
      qc.invalidateQueries({ queryKey: ["clients:options"], exact: false });
      qc.invalidateQueries({
        queryKey: [CLIENT_DETAILS_EDIT_KEY, id],
        exact: true,
      });

      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

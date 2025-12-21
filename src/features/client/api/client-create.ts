import { createContactSchema } from "@/features/shared/contact/schema/contact.schema";
import { createLegalProfileSchema } from "@/features/shared/legal-profile/types/legal-profile.type";
import { createTranslationSchema } from "@/lib/auth";
import z from "zod";

export const createClientSchema = z.object({
  party: z.object({
    name: createTranslationSchema("clients.fields.name.errors"),
    party_type_id: z
      .string()
      .min(1, "clients.fields.party_type.errors.required"),
    parent_id: z.string().optional(),
    national_id: z.string().optional(),
    note: z.string().optional(),
  }),
  contact: createContactSchema,
  legal_profile: createLegalProfileSchema,
});

export type CreateClientInputs = z.infer<typeof createClientSchema>;

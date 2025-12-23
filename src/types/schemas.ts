import { z } from "zod";
export const createContactSchema = z.object({
  email: z.email().optional(),

  mobile: z.string().optional(),

  landline: z.string().optional(),

  address: z.string().optional(),

  postal: z.string().optional(),
});

export const createLegalProfileSchema = z.object({
  business_register: z.string().optional(),

  fiscal_id: z.string().optional(),

  ice: z.string().optional(),

  legal_status: z.string().optional(),

  legal_representative: z.string().optional(),

  legal_representative_phone: z.string().optional(),
});

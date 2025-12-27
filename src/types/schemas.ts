import { z } from "zod";
export const createContactSchema = z.object({
  email: z.string().email().optional().nullable(),
  mobile: z.string().optional().nullable(),
  landline: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  postal: z.string().optional().nullable(),
});


export const createLegalProfileSchema = z.object({
  business_register: z.string().optional().nullable(),
  fiscal_id: z.string().optional().nullable(),
  ice: z.string().optional().nullable(),
  legal_status: z.string().optional(),
  legal_representative: z.string().optional().nullable(),
  legal_representative_phone: z.string().optional().nullable(),
});

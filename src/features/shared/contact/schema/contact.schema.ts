

import { z } from "zod";

export const createContactSchema = z.object({
  email: z
    .string()
    .email()
    .optional()
    .nullable(),

  mobile: z
    .string()
    .optional()
    .nullable(),

  landline: z
    .string()
    .optional()
    .nullable(),

  address: z
    .string()
    .optional()
    .nullable(),

  postal: z
    .string()
    .optional()
    .nullable(),
});

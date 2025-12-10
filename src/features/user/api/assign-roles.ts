import z from "zod";

export const assignRolesSchema = z.object({
  userId: z.string(),
  roleIds: z.array(z.string()),
});

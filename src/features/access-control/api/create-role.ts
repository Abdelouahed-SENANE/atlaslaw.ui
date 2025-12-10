import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { ROLES_KEY } from "./list-roles";

export const createRoleSchema = z.object({
  name: z.string().min(1, "roles.fields.name.errors.required"),
  description: z.string().min(10, "roles.fields.description.errors.required"),
});

export type CreateRoleInputs = z.infer<typeof createRoleSchema>;

const createRole = ({ payload }: { payload: CreateRoleInputs }) => {
  return api$.post("/roles", payload);
};

export const useCreateRole = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createRole>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createRole,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [ROLES_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

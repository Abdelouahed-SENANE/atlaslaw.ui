import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { ROLES_KEY } from "./list-roles";
import { ROLE_KEY } from "./role-details";

export const updateRoleSchema = z.object({
  name: z.string().min(1, "roles.fields.name.errors.required"),
  description: z.string().min(10, "roles.fields.description.errors.required"),
  scope: z.enum(["system", "tenant"], "roles.fields.scope.errors.required"),
});

export type UpdateRoleInputs = z.infer<typeof updateRoleSchema>;

const updateRole = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateRoleInputs;
}) => {
  return api$.put(`/roles/${id}`, payload);
};

export const useUpdateRole = ({
  mutationConfig,
  id,
}: {
  mutationConfig?: MutationConfig<typeof updateRole>;
  id: string;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateRole,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [ROLES_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [ROLE_KEY, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

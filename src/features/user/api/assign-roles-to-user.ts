import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { AVAIBLE_ROLES_KEY } from "./availables-roles";

export const assignRolesToUserSchema = z.object({
  role_ids: z.array(z.string()),
});

export type UpdateUserRolesInputs = z.infer<typeof assignRolesToUserSchema>;

const updateUserRoles = ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateUserRolesInputs;
}) => {
  return api$.put(`/users/${id}/roles`, payload);
};

export const useAssignRoles = ({
  mutationConfig,
  id 
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateUserRoles>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateUserRoles,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [AVAIBLE_ROLES_KEY, id], exact: true })
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

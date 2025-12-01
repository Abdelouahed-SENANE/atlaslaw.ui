import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { AUTH_KEY } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { ROLE_PERMISSIONS_KEY } from "./get-role-permissions";

const ACTIONS = ["create", "update", "list", "delete"] as const;

const permissionPattern = new RegExp(`^(${ACTIONS.join("|")}):[a-z_]+$`);

export const updateRolePermissionsSchema = z.object({
  codes: z
    .array(
      z
        .string()
        .regex(
          permissionPattern,
          "roles.fields.permissions.errors.invalid_permission"
        )
    )
    .optional(),
});

export type UpdateRolePermissionsInputs = z.infer<
  typeof updateRolePermissionsSchema
>;

const updateRolePermissions = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateRolePermissionsInputs;
}) => {
  api$.put(`/roles/${id}/permissions`, payload);
};
export const useUpdateRolePermissions = ({
  mutationConfig,
  id,
}: {
  mutationConfig?: MutationConfig<typeof updateRolePermissions>;
  id: string;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: ({ payload }) => updateRolePermissions({ id, payload }), // <— use injected id

    onSuccess: (...args) => {
      qc.invalidateQueries({
        queryKey: [ROLE_PERMISSIONS_KEY, id],
        exact: true, // <— use injected id
      });
      qc.invalidateQueries({
        queryKey: [AUTH_KEY],
      });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

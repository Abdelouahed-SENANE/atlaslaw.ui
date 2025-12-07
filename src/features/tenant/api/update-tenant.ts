import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { TenantStatus } from "../types";
import { TENANTS_KEY } from "./list-tenants";
import { TENANT_KEY } from "./tenant-details";

export const updateTenantSchema = z.object({
  name: z.string().min(1, "tenants.fields.name.errors.required"),
  slug: z.string().min(3, "tenants.fields.slug.errors.required"),
  status: z.enum(
    [TenantStatus.ACTIVE, TenantStatus.SUSPENDED],
    "tenants.fields.status.errors.required"
  ),
  owner_id: z.string().min(10, "tenants.fields.owner_id.errors.required"),
});

export type UpdateTenantInputs = z.infer<typeof updateTenantSchema>;

const updateTenant = ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<UpdateTenantInputs>;
}) => {
  return api$.put(`/tenants/${id}`, payload);
};

export const useUpdateTenant = ({
  mutationConfig,
  id,
}: {
  id: string;
  mutationConfig?: MutationConfig<typeof updateTenant>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: updateTenant,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [TENANTS_KEY], exact: false });
      qc.invalidateQueries({ queryKey: [TENANT_KEY, id], exact: true });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

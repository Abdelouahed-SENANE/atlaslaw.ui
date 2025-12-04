import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { TenantStatus } from "../types";
import { TENANTS_KEY } from "./list-tenants";

export const createTenantSchema = z.object({
  name: z.string().min(1, "tenants.fields.name.errors.required"),
  slug: z.string().min(3, "tenants.fields.slug.errors.required"),
  status: z.enum(
    [TenantStatus.ACTIVE, TenantStatus.SUSPENDED],
    "tenants.fields.status.errors.required"
  ),
  owner_id: z.string().min(10, "tenants.fields.owner_id.errors.required"),
});

export type CreateTenantInputs = z.infer<typeof createTenantSchema>;

const createTenant = ({ payload }: { payload: CreateTenantInputs }) => {
  return api$.post("/tenants", payload);
};

export const useCreateTenant = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof createTenant>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createTenant,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [TENANTS_KEY], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

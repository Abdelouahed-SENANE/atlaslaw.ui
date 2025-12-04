import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../types";

export const TENANT_KEY = "tenant-details";

const getTenant = async (id: string): Promise<ApiResponse<Tenant>> => {
  const response = await api$.get<ApiResponse<Tenant>>(`/tenants/${id}`);

  return response.data;
};

export const getTenantQueryOptions = (id: string) => {
  return {
    queryKey: [TENANT_KEY, id],
    queryFn: () => getTenant(id),
  };
};

type UseTenantOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getTenantQueryOptions>>;
};

export const useTenant = ({ id, queryConfig }: UseTenantOptions) => {
  return useQuery({
    ...getTenantQueryOptions(id),
    ...queryConfig,
  });
};

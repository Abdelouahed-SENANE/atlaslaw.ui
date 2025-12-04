import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../types";

export const TENANTS_KEY = "tenants";

export interface TenantParams {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: keyof Tenant;
  sort_dir?: "asc" | "desc";
  status?: "active" | "suspended" | "";
}
export const defaultTenantParams: Required<TenantParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort_by: "created_at",
  sort_dir: "desc",
  status: "",
};

export const normalizeTenantParams = (params: TenantParams) => {
  return {
    ...defaultTenantParams,
    ...params,
  };
};

const getTenants = async (
  params: TenantParams
): Promise<ApiResponse<Paginated<Tenant>>> => {
  const normalized = normalizeTenantParams(params);

  const response = await api$.get<ApiResponse<Paginated<Tenant>>>("/tenants", {
    params: {
      ...normalized,
      ...(normalized.query && { query: normalized.query }),
    },
  });

  return response.data;
};

export const getTenantsQueryOptions = (params: TenantParams) => {
  const normalized = normalizeTenantParams(params);
  return {
    queryKey: [TENANTS_KEY, normalized],
    queryFn: () => getTenants(normalized),
  };
};

type UseTenantsOptions = {
  params?: TenantParams;
  queryConfig?: Partial<QueryConfig<typeof getTenantsQueryOptions>>;
};

export const useTenants = ({ params, queryConfig }: UseTenantsOptions) => {
  return useQuery({
    ...getTenantsQueryOptions(params || {}),
    ...queryConfig,
  });
};

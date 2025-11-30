import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated, Role } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const ROLES_KEY = "roles";

export interface RoleParams {
  query?: string;
  page?: number;
  limit?: number;
}
export const defaultRoleParams: Required<RoleParams> = {
  query: "",
  page: 1,
  limit: 10,
};

export const normalizeRoleParams = (params: RoleParams) => {
  return {
    ...defaultRoleParams,
    ...params,
  };
};

const getRoles = async (
  params: RoleParams
): Promise<ApiResponse<Paginated<Role>>> => {
  const normalized = normalizeRoleParams(params);

  const response = await api$.get<ApiResponse<Paginated<Role>>>("/roles", {
    params: {
      ...normalized,
      ...(normalized.query && { query: normalized.query }),
    },
  });

  return response.data; // now valid
};

export const getRolesQueryOptions = (params: RoleParams) => {
  const normalized = normalizeRoleParams(params);
  return {
    queryKey: [ROLES_KEY, normalized],
    queryFn: () => getRoles(normalized),
  };
};

type UseRolesOptions = {
  params?: RoleParams;
  queryConfig?: Partial<QueryConfig<typeof getRolesQueryOptions>>;
};

export const useRoles = ({ params, queryConfig }: UseRolesOptions) => {

  return useQuery({
    ...getRolesQueryOptions(params || {}),
    ...queryConfig,
  });
};

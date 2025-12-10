import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { RolePermission } from "../types";

export const ROLE_PERMISSIONS_KEY = "role-permissions";

const getRolePermissions = async (
  id: string
): Promise<ApiResponse<RolePermission>> => {
  const response = await api$.get<ApiResponse<RolePermission>>(
    `/roles/${id}/permissions`
  );

  return response.data; // now valid
};

export const getRolePermissionsQueryOptions = (id: string) => {
  return {
    queryKey: [ROLE_PERMISSIONS_KEY, id],
    queryFn: () => getRolePermissions(id),
  };
};

type UseRolePermissionsOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getRolePermissionsQueryOptions>>;
};

export const useRolePermissions = ({
  id,
  queryConfig,
}: UseRolePermissionsOptions) => {
  return useQuery({
    ...getRolePermissionsQueryOptions(id),
    ...queryConfig,
  });
};

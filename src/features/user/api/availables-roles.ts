import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { UserRole } from "../types";

export const AVAIBLE_ROLES_KEY = ["available-roles"];

const getAvailableRoles = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<UserRole[]>> => {
  const response = await api$.get<ApiResponse<UserRole[]>>(
    `/users/${id}/roles`
  );
  return response.data;
};

export const getAvailableRolesQueryOptions = ({ id }: { id: string }) => {
  return {
    queryKey: [AVAIBLE_ROLES_KEY, id],
    queryFn: () => getAvailableRoles({ id }),
  };
};

type UseAvailableRolesOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getAvailableRolesQueryOptions>>;
};

export const useAvailableRoles = ({ id, queryConfig }: UseAvailableRolesOptions) => {
  return useQuery({
    ...getAvailableRolesQueryOptions({ id }),
    ...queryConfig,
  });
};

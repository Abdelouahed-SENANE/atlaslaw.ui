import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Role } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const ROLE_KEY = "role";

const getRole = async (
  id: string
): Promise<ApiResponse<Role>> => {
  const response = await api$.get<ApiResponse<Role>>(
    `/roles/${id}`
  );

  return response.data; 
};

export const getRoleQueryOptions = (id: string) => {
  return {
    queryKey: [ROLE_KEY, id],
    queryFn: () => getRole(id),
  };
};

type UseRoleOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getRoleQueryOptions>>;
};

export const useRole = ({
  id,
  queryConfig,
}: UseRoleOptions) => {
  return useQuery({
    ...getRoleQueryOptions(id),
    ...queryConfig,
  });
};

import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ClientDetails } from "../types/client.type";

export const CLIENT_KEY = "client-details";

const getClientDetails = async (id: string): Promise<ApiResponse<ClientDetails>> => {
  const response = await api$.get<ApiResponse<ClientDetails>>(`/clients/${id}`);
  return response.data;
};

export const getClientQueryOptions = (id: string) => {
  return {
    queryKey: [CLIENT_KEY, id],
    queryFn: () => getClientDetails(id),
  };
};

type UseClientDetailsOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getClientQueryOptions>>;
};

export const useClientDetails = ({ id, queryConfig }: UseClientDetailsOptions) => {
  return useQuery({
    ...getClientQueryOptions(id),
    ...queryConfig,
  });
};

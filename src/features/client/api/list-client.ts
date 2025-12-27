import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Client } from "../types/client.type";

export const CLIENTS_KEY = ["clients"];

export interface ClientParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof Client;
  order?: "asc" | "desc";
}
export const defaultClientParams: Required<ClientParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeClientParams = (params: ClientParams) => {
  return {
    ...defaultClientParams,
    ...params,
  };
};

const getClients = async (
  params: ClientParams
): Promise<ApiResponse<Paginated<Client>>> => {
  const normalized = normalizeClientParams(params);

  const response = await api$.get<ApiResponse<Paginated<Client>>>(
    "/clients",
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    }
  );

  return response.data;
};

export const getClientsQueryOptions = (params: ClientParams) => {
  const normalized = normalizeClientParams(params);
  return {
    queryKey: [CLIENTS_KEY, normalized],
    queryFn: () => getClients(normalized),
  };
};

type UseClientsOptions = {
  params?: ClientParams;
  queryConfig?: Partial<QueryConfig<typeof getClientsQueryOptions>>;
};

export const useClients = ({ params, queryConfig }: UseClientsOptions) => {
  return useQuery({
    ...getClientsQueryOptions(params || {}),
    ...queryConfig,
  });
};

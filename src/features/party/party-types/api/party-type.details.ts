import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { PartyType } from "../types/party-type";

export const PARTY_TYPE_KEY = "party-type-details";

const getClientType = async (id: string): Promise<ApiResponse<PartyType>> => {
  const response = await api$.get<ApiResponse<PartyType>>(
    `/parties/types/${id}`
  );

  return response.data;
};

export const getClientTypeQueryOptions = (id: string) => {
  return {
    queryKey: [PARTY_TYPE_KEY, id],
    queryFn: () => getClientType(id),
  };
};

type UseClientTypeOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getClientTypeQueryOptions>>;
};

export const useClientType = ({ id, queryConfig }: UseClientTypeOptions) => {
  return useQuery({
    ...getClientTypeQueryOptions(id),
    ...queryConfig,
  });
};

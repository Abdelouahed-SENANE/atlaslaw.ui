import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { PartyType } from "../types/party-type";

export const PARTY_TYPES_KEY = ["client-types"];

export interface PartyTypesParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof PartyType;
  order?: "asc" | "desc";
}
export const defaultPartyTypesParams: Required<PartyTypesParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizePartyTypesParams = (params: PartyTypesParams) => {
  return {
    ...defaultPartyTypesParams,
    ...params,
  };
};

const getPartyTypess = async (
  params: PartyTypesParams
): Promise<ApiResponse<Paginated<PartyType>>> => {
  const normalized = normalizePartyTypesParams(params);

  const response = await api$.get<ApiResponse<Paginated<PartyType>>>(
    "/parties/types",
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    }
  );

  return response.data;
};

export const getPartyTypessQueryOptions = (params: PartyTypesParams) => {
  const normalized = normalizePartyTypesParams(params);
  return {
    queryKey: [PARTY_TYPES_KEY, normalized],
    queryFn: () => getPartyTypess(normalized),
  };
};

type UsePartyTypessOptions = {
  params?: PartyTypesParams;
  queryConfig?: Partial<QueryConfig<typeof getPartyTypessQueryOptions>>;
};

export const usePartyTypess = ({
  params,
  queryConfig,
}: UsePartyTypessOptions) => {
  return useQuery({
    ...getPartyTypessQueryOptions(params || {}),
    ...queryConfig,
  });
};

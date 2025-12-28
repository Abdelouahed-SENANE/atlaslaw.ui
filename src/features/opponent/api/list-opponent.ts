import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { OpponentView } from "../types/opponent.type";

export const OPPONENTS_KEY = ["opponents"];

export interface OpponentParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof OpponentView;
  order?: "asc" | "desc";
}
export const defaultOpponentParams: Required<OpponentParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeOpponentParams = (params: OpponentParams) => {
  return {
    ...defaultOpponentParams,
    ...params,
  };
};

const getOpponents = async (
  params: OpponentParams
): Promise<ApiResponse<Paginated<OpponentView>>> => {
  const normalized = normalizeOpponentParams(params);

  const response = await api$.get<ApiResponse<Paginated<OpponentView>>>(
    "/opponents",
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    }
  );

  return response.data;
};

export const getOpponentsQueryOptions = (params: OpponentParams) => {
  const normalized = normalizeOpponentParams(params);
  return {
    queryKey: [OPPONENTS_KEY, normalized],
    queryFn: () => getOpponents(normalized),
  };
};

type UseOpponentsOptions = {
  params?: OpponentParams;
  queryConfig?: Partial<QueryConfig<typeof getOpponentsQueryOptions>>;
};

export const useOpponents = ({ params, queryConfig }: UseOpponentsOptions) => {
  return useQuery({
    ...getOpponentsQueryOptions(params || {}),
    ...queryConfig,
  });
};

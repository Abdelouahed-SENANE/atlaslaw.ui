import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { HearingView } from "../types/case.type";

export const HEARINGS_KEY = ["hearings"];

export interface HearingParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof HearingView;
  order?: "asc" | "desc";
}
export const defaultHearingParams: Required<HearingParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeHearingParams = (params: HearingParams) => {
  return {
    ...defaultHearingParams,
    ...params,
  };
};

const getHearings = async (
  params: HearingParams,
): Promise<ApiResponse<Paginated<HearingView>>> => {
  const normalized = normalizeHearingParams(params);

  const response = await api$.get<ApiResponse<Paginated<HearingView>>>(
    `/hearings`,
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    },
  );

  return response.data;
};

export const getHearingsQueryOptions = (
  params: HearingParams,
) => {
  const normalized = normalizeHearingParams(params);
  return {
    queryKey: [HEARINGS_KEY, normalized],
    queryFn: () => getHearings(normalized),
  };
};

type UseHearingsOptions = {
  params?: HearingParams;
  queryConfig?: Partial<QueryConfig<typeof getHearingsQueryOptions>>;
};

export const useHearings = ({
  params,
  queryConfig,
}: UseHearingsOptions) => {
  return useQuery({
    ...getHearingsQueryOptions( params || {}),
    ...queryConfig,
  });
};

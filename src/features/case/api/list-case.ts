import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { CaseView } from "../types/case.type";

export const CASES_KEY = ["cases"];

export interface CaseParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof CaseView;
  order?: "asc" | "desc";
}
export const defaultCaseParams: Required<CaseParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeCaseParams = (params: CaseParams) => {
  return {
    ...defaultCaseParams,
    ...params,
  };
};

const getCases = async (
  params: CaseParams
): Promise<ApiResponse<Paginated<CaseView>>> => {
  const normalized = normalizeCaseParams(params);

  const response = await api$.get<ApiResponse<Paginated<CaseView>>>(
    "/cases",
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    }
  );

  return response.data;
};

export const getCasesQueryOptions = (params: CaseParams) => {
  const normalized = normalizeCaseParams(params);
  return {
    queryKey: [CASES_KEY, normalized],
    queryFn: () => getCases(normalized),
  };
};

type UseCasesOptions = {
  params?: CaseParams;
  queryConfig?: Partial<QueryConfig<typeof getCasesQueryOptions>>;
};

export const useCases = ({ params, queryConfig }: UseCasesOptions) => {
  return useQuery({
    ...getCasesQueryOptions(params || {}),
    ...queryConfig,
  });
};

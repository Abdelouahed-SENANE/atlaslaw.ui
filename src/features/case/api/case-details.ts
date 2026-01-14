import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { CaseDetails } from "../types/case.type";

export const CASE_KEY = "case-details";

const getCaseDetails = async (id: string): Promise<ApiResponse<CaseDetails>> => {
  const response = await api$.get<ApiResponse<CaseDetails>>(`/cases/${id}`);
  return response.data;
};

export const getCaseQueryOptions = (id: string) => {
  return {
    queryKey: [CASE_KEY, id],
    queryFn: () => getCaseDetails(id),
  };
};

type UseCaseDetailsOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getCaseQueryOptions>>;
};

export const useCaseDetails = ({ id, queryConfig }: UseCaseDetailsOptions) => {
  return useQuery({
    ...getCaseQueryOptions(id),
    ...queryConfig,
  });
};

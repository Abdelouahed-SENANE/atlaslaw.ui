import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse } from "@/types/api";
import { CaseOption } from "../types/case.type";

export const getCaseOptions: FectchOptionFn<CaseOption> = async ({
  query,
  limit,
}) => {
  const response = await api$.get<ApiResponse<CaseOption>>(`/cases/options`, {
    params: {
      query,
      limit,
    },
  });
  return response.data;
};

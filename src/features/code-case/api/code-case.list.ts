import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { CodeCase } from "../types/code-case.type";

export const CODE_CASES_KEY = ["code-cases"];

const getCodeCases = async (): Promise<ApiResponse<CodeCase[]>> => {
  const response = await api$.get<ApiResponse<CodeCase[]>>("/code-cases");

  return response.data;
};

export const getCodeCasesQueryOptions = () => {
  return {
    queryKey: [CODE_CASES_KEY],
    queryFn: () => getCodeCases(),
  };
};

type UseCodeCasesOptions = {
  queryConfig?: Partial<QueryConfig<typeof getCodeCasesQueryOptions>>;
};

export const useCodeCases = ({ queryConfig }: UseCodeCasesOptions) => {
  return useQuery({
    ...getCodeCasesQueryOptions(),
    ...queryConfig,
  });
};

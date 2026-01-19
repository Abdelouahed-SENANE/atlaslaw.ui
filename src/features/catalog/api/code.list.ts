import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Code } from "../types/catalog.type";

export const CODES = ["codes"];

const getCodes = async (prefix: string): Promise<ApiResponse<Code[]>> => {
  const response = await api$.get<ApiResponse<Code[]>>(
    `/catalog/${prefix}/codes`,
  );

  return response.data;
};

export const getCodesQueryOptions = (prefix: string) => {
  return {
    queryKey: [CODES, prefix],
    queryFn: () => getCodes(prefix),
  };
};

type UseCodesOptions = {
  prefix: string;
  queryConfig?: Partial<QueryConfig<typeof getCodesQueryOptions>>;
};

export const useCodes = ({ prefix, queryConfig }: UseCodesOptions) => {
  return useQuery({
    ...getCodesQueryOptions(prefix),
    ...queryConfig,
  });
};

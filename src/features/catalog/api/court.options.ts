import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, BaseOption } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const COURT_OPTIONS = ["courts-options"];

const getCourts = async (): Promise<ApiResponse<BaseOption[]>> => {
  const response = await api$.get<ApiResponse<BaseOption[]>>(
    "/catalog/courts/options",
  );

  return response.data;
};

export const getCourtsQueryOptions = () => {
  return {
    queryKey: [COURT_OPTIONS],
    queryFn: () => getCourts(),
  };
};

type UseCourtsOptions = {
  queryConfig?: Partial<QueryConfig<typeof getCourtsQueryOptions>>;
};

export const useCourtsOptions = ({ queryConfig }: UseCourtsOptions) => {
  return useQuery({
    ...getCourtsQueryOptions(),
    ...queryConfig,
    staleTime: Infinity,
  });
};

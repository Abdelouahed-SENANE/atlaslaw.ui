import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Court } from "../types/catalog.type";

export const APPEAL_COURTS = ["appeal-courts"];

const getCourts = async (params: {
  court_type: string;
  level: "APPEAL" | "PRIMARY";
  parent_code?: string;
}): Promise<ApiResponse<Court[]>> => {
  const response = await api$.get<ApiResponse<Court[]>>("/catalog/courts", {
    params,
  });

  return response.data;
};

export const getCourtsQueryOptions = ({
  court_type,
  level,
  parent_code,
}: {
  court_type: string;
  level: "APPEAL" | "PRIMARY";
  parent_code?: string;
}) => {
  return {
    queryKey: [APPEAL_COURTS, court_type, parent_code, level],
    queryFn: () => getCourts({ court_type, level, parent_code }),
  };
};

type UseCourtsOptions = {
  court_type: string;
  level: "APPEAL" | "PRIMARY";
  parent_code?: string;
  queryConfig?: Partial<QueryConfig<typeof getCourtsQueryOptions>>;
};

export const useCourts = ({
  court_type,
  level,
  parent_code,
  queryConfig,
}: UseCourtsOptions) => {
  return useQuery({
    ...getCourtsQueryOptions({ court_type, level, parent_code }),
    ...queryConfig,
  });
};

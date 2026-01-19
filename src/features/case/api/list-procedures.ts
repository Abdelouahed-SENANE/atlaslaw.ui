import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse, Paginated } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ProcedureView } from "../types/case.type";

export const PROCEDURES_KEY = ["cases"];

export interface ProcedureParams {
  query?: string;
  page?: number;
  limit?: number;
  sort?: keyof ProcedureView;
  order?: "asc" | "desc";
}
export const defaultProcedureParams: Required<ProcedureParams> = {
  query: "",
  page: 1,
  limit: 10,
  sort: "created_at",
  order: "desc",
};

export const normalizeProcedureParams = (params: ProcedureParams) => {
  return {
    ...defaultProcedureParams,
    ...params,
  };
};

const getProcedures = async (
  caseId: string,
  params: ProcedureParams,
): Promise<ApiResponse<Paginated<ProcedureView>>> => {
  const normalized = normalizeProcedureParams(params);

  const response = await api$.get<ApiResponse<Paginated<ProcedureView>>>(
    `/cases/${caseId}/procedures`,
    {
      params: {
        ...normalized,
        ...(normalized.query && { query: normalized.query }),
      },
    },
  );

  return response.data;
};

export const getProceduresQueryOptions = ( caseId: string, params: ProcedureParams) => {
  const normalized = normalizeProcedureParams(params);
  return {
    queryKey: [PROCEDURES_KEY, normalized , caseId],
    queryFn: () => getProcedures( caseId, normalized),
  };
};

type UseProceduresOptions = {
  caseId: string;
  params?: ProcedureParams;
  queryConfig?: Partial<QueryConfig<typeof getProceduresQueryOptions>>;
};

export const useProcedures = ({
  caseId,
  params,
  queryConfig,
}: UseProceduresOptions) => {
  return useQuery({
    ...getProceduresQueryOptions( caseId, params || {}),
    ...queryConfig,
  });
};

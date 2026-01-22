import { api$ } from "@/config/axios";
import { ApiResponse } from "@/types/api";
import { ProcedureOption } from "../types/case.type";

type GetProcedureOptionsParams = {
  caseId: string;
  query?: string;
  limit: number; 
};

export const getProcedureOptions = async ({
  caseId,
  query,
  limit,
}: GetProcedureOptionsParams): Promise<ApiResponse<ProcedureOption>> => {
  const response = await api$.get<ApiResponse<ProcedureOption>>(
    `/cases/${caseId}/procedures/options`,
    {
      params: {
        query,
        limit,
      },
    }
  );

  return response.data;
};

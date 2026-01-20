import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ProcedureFormView } from "../types/case.type";

/* ---------------------------------------------
 * Query key
 * -------------------------------------------*/
export const PROCEDURE_FORM_QK = ["procedure-form"] as const;

/* ---------------------------------------------
 * Fetcher
 * -------------------------------------------*/
const fetchProcedureForm = async (
  id: string,
): Promise<ApiResponse<ProcedureFormView>> => {
  const response = await api$.get<ApiResponse<ProcedureFormView>>(
    `cases/procedures/${id}/form`,
  );
  return response.data;
};

/* ---------------------------------------------
 * Query options
 * -------------------------------------------*/
export const getProcedureFormQueryOptions = (id: string) => ({
  queryKey: [PROCEDURE_FORM_QK, id],
  queryFn: () => fetchProcedureForm(id),
  enabled: !!id,
});

/* ---------------------------------------------
 * Hook
 * -------------------------------------------*/
type UseProcedureFormOptions = {
  id: string;
  queryConfig?: Partial<
    QueryConfig<typeof getProcedureFormQueryOptions>
  >;
};

export const useProcedureForm = ({
  id,
  queryConfig,
}: UseProcedureFormOptions) => {
  return useQuery({
    ...getProcedureFormQueryOptions(id),
    ...queryConfig,
  });
};

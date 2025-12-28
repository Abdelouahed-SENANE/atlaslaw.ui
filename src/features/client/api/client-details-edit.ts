import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { ClientEditView } from "../types/client.type";

export const CLIENT_DETAILS_EDIT_KEY = "client-details-edit";

const getClientForEdit = async (id: string): Promise<ApiResponse<ClientEditView>> => {
  const response = await api$.get<ApiResponse<ClientEditView>>(`/clients/${id}/edit`);
  return response.data;
};

export const getClientQueryOptions = (id: string) => {
  return {
    queryKey: [CLIENT_DETAILS_EDIT_KEY, id],
    queryFn: () => getClientForEdit(id),
  };
};

type UseClientForEditOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getClientQueryOptions>>;
};

export const useClientForEdit = ({ id, queryConfig }: UseClientForEditOptions) => {
  return useQuery({
    ...getClientQueryOptions(id),
    ...queryConfig,
  });
};

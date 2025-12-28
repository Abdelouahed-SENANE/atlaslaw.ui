import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { OpponentEditView } from "../types/opponent.type";

export const OPPONENT_DETAILS_EDIT_KEY = "opponent-details-edit";

const getOpponentForEdit = async (id: string): Promise<ApiResponse<OpponentEditView>> => {
  const response = await api$.get<ApiResponse<OpponentEditView>>(`/opponents/${id}/edit`);
  return response.data;
};

export const getOpponentQueryOptions = (id: string) => {
  return {
    queryKey: [OPPONENT_DETAILS_EDIT_KEY, id],
    queryFn: () => getOpponentForEdit(id),
  };
};

type UseOpponentForEditOptions = {
  id: string;
  queryConfig?: Partial<QueryConfig<typeof getOpponentQueryOptions>>;
};

export const useOpponentForEdit = ({ id, queryConfig }: UseOpponentForEditOptions) => {
  return useQuery({
    ...getOpponentQueryOptions(id),
    ...queryConfig,
  });
};

import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse , BaseOption } from "@/types/api";

export const getOpponentOptions: FectchOptionFn<BaseOption> = async ({
  query,
}) => {
  const response = await api$.get<ApiResponse<BaseOption>>(
    `/opponents/options`,
    {
      params: {
        query,
      },
    }
  );
  return response.data;
};

import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse, Paginated , BaseOption } from "@/types/api";

export const getClientOptions: FectchOptionFn<BaseOption> = async ({
  query,
  page,
  limit,
}) => {
  const response = await api$.get<ApiResponse<Paginated<BaseOption>>>(
    `/clients/options`,
    {
      params: {
        query,
        page,
        limit,
      },
    }
  );
  return response.data;
};

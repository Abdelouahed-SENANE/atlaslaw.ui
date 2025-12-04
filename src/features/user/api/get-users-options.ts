import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse, Paginated, UserOption } from "@/types/api";


export const getUsersOptions: FectchOptionFn<UserOption> = async ({
  query,
  page,
  limit,
}) => {
  const response = await api$.get<ApiResponse<Paginated<UserOption>>>(
    `/users/options`,
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

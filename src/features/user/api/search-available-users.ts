import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse, Paginated } from "@/types/api";
import { UserOption } from "../types";

export const getUsersOptions: FectchOptionFn<UserOption> = async ({
  query,
  page,
  limit,
}) => {
  const response = await api$.get<ApiResponse<Paginated<UserOption>>>(
    `/users/search`,
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

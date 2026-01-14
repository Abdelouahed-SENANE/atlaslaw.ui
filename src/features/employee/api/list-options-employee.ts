import { api$ } from "@/config/axios";
import { FectchOptionFn } from "@/hooks/use-infinite-options";
import { ApiResponse , BaseOption } from "@/types/api";

export const getEmployeeOptions: FectchOptionFn<BaseOption> = async ({
  query,
}) => {
  const response = await api$.get<ApiResponse<BaseOption>>(
    `/employees/options`,
    {
      params: {
        query,
      },
    }
  );
  return response.data;
};

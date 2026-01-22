import { api$ } from "@/config/axios";
import { ApiResponse, BaseOption } from "@/types/api";

type ClientOption = BaseOption;

export const getClientOptions = async ({
  query,
  limit,
}: {
  query?: string;
  limit: number;
}): Promise<ApiResponse<ClientOption>> => {
  const response = await api$.get<ApiResponse<ClientOption>>(
    "/clients/options",
    {
      params: {
        query,
        limit,
      },
    }
  );

  return response.data;
};

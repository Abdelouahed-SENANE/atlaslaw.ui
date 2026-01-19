import { api$ } from "@/config/axios";
import { QueryConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/catalog.type";

export const CATEGORIES = ["categories"];

const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await api$.get<ApiResponse<Category[]>>(
    "/catalog/categories"
  );

  return response.data;
};

export const getCategoriesQueryOptions = () => {
  return {
    queryKey: [CATEGORIES],
    queryFn: () => getCategories(),
  };
};

type UseCategoriesOptions = {
  queryConfig?: Partial<QueryConfig<typeof getCategoriesQueryOptions>>;
};

export const useCategories = ({ queryConfig }: UseCategoriesOptions) => {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
};

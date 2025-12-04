import { ApiResponse, BaseOption, Paginated } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebouce } from "./use-debounce";

export type FectchOptionFn<TOptions extends BaseOption> = (params: {
  query?: string;
  page: number;
  limit: number;
}) => Promise<ApiResponse<Paginated<TOptions>>>;
export function useInfiniteOptions<TOptions extends BaseOption>({
  fetchFn,
  term,
  limit,
}: {
  fetchFn: FectchOptionFn<TOptions>;
  term?: string;
  limit?: number;
}) {
  const deboucedTerm = useDebouce(term, 500);

  const query = useInfiniteQuery({
    queryKey: ["options", deboucedTerm],
    queryFn: ({ pageParam = 1 }) =>
      fetchFn({
        query: deboucedTerm || undefined,
        page: pageParam,
        limit: limit || 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (!pagination || !pagination.has_next) return undefined;
      return pagination.page + 1;
    },
    staleTime: 1000 * 60 * 10,
  });

  const items = query.data?.pages.flatMap((page) => page.data?.items) ?? [];

  return {
    ...query,
    items,
  };
}

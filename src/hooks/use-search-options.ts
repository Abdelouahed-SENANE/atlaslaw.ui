import { BaseOption } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useDebouce } from "./use-debounce";
import { FectchOptionFn } from "./use-infinite-options";

export function useSearchOptions<TOptions extends BaseOption>({
  fetchFn,
  term,
  limit = 20,
  queryKey,
  enabled = true,
  minLength = 0,
}: {
  fetchFn: FectchOptionFn<TOptions>;
  term?: string;
  limit?: number;
  queryKey: string;
  enabled?: boolean;
  minLength?: number;
}) {
  const debouncedTerm = useDebouce(term, 400);

  const canFetch =
    enabled && (debouncedTerm ? debouncedTerm.length >= minLength : true);

  const query = useQuery({
    queryKey: [queryKey, debouncedTerm],
    enabled: canFetch,
    queryFn: () =>
      fetchFn({
        query: debouncedTerm || undefined,
        limit,
      }),
    staleTime: 1000 * 60 * 10,
  });

  return {
    ...query,
    items: query.data?.data ?? [],
  };
}

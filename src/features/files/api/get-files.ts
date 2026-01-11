import { api$ } from "@/config/axios";
import { ApiResponse } from "@/types/api";
import { FileOwnerType, FileView } from "../types/file.type";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export const FILES_KEY = "files";
export const getFiles = async ({
  ownerId,
  ownerType,
}: {
  ownerId: string; ownerType: FileOwnerType;
}): Promise<ApiResponse<FileView[]>> => {
  const response = await api$.get<ApiResponse<FileView[]>>(`/files`, {
    params: {
      owner_id: ownerId,
      owner_type: ownerType,
    },
  });
  return response.data;
};

export const getFilesQueryOptions = ({
  ownerId,
  ownerType,
}: {
  ownerId: string;
  ownerType: FileOwnerType;
}) => {
  return {
    queryKey: [FILES_KEY, ownerId, ownerType],
    queryFn: () => getFiles({ ownerId, ownerType }),
  };
};

type UseFilesOptions = {
  ownerId: string;
  ownerType: FileOwnerType;
  queryConfig?: UseQueryOptions<Awaited<ReturnType<typeof getFiles>>>;
};

export const useFiles = ({
  ownerId,
  ownerType,
  queryConfig,
}: UseFilesOptions) => {
  return useQuery({
    ...getFilesQueryOptions({  ownerId, ownerType }),
    ...queryConfig,
  });
};

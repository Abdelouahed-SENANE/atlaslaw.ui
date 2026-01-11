import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { ApiResponse } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FILES_KEY } from "./get-files";

export const deleteFile = async ({
  id,
}: {
  id: string;
}): Promise<ApiResponse<void>> => {
  return api$.delete(`/files/${id}`);
};

type UseDeleteFileOptions = {
  mutationConfig?: MutationConfig<typeof deleteFile>;
};

export const useDeleteFile = ({
  mutationConfig,
}: UseDeleteFileOptions = {}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [FILES_KEY], exact: false });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

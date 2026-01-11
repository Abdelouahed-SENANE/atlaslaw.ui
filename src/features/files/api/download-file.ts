import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation } from "@tanstack/react-query";

const downloadFile = async ({ id }: { id: string }) => {
  const res = await api$.get(`/files/${id}/download`, {
    responseType: "blob",
  });
  return res;
};
export const useDownloadFile = ({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof downloadFile>}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: downloadFile,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

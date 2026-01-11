import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation } from "@tanstack/react-query";

const previewFile = async ({ id }: { id: string }) => {
  const res = await api$.get(`/files/${id}/preview`, {
    responseType: "blob",
  });
  return res;
};
export const usePreviewFile = ({
  mutationConfig,
}: { mutationConfig?: MutationConfig<typeof previewFile>}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: previewFile,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};

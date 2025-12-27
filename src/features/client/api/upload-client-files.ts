import { api$ } from "@/config/axios";
import { MutationConfig } from "@/config/react-query";
import { useMutation } from "@tanstack/react-query";

const uploadClientFiles = ({
  clientId,
  files,
}: {
  clientId: string;
  files: File[];
}) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  return api$.post(`/clients/${clientId}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const useUploadClientFiles = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof uploadClientFiles>;
}) => {
  return useMutation({
    mutationFn: uploadClientFiles,
    ...mutationConfig,
  });
};

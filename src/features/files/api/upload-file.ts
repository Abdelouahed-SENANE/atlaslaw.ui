import { api$ } from "@/config/axios";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/config/react-query";
import { FILE_OWNER_TYPES, FileOwnerType } from "../types/file.type";
import { FILES_KEY } from "./get-files";
import { ApiResponse } from "@/types/api";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_FILES = 10;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export const uploadFilesSchema = z.object({
  files: z
    .any()
    .transform((value) =>
      value instanceof FileList ? Array.from(value) : value
    )
    .refine(Array.isArray, "Invalid files input")
    .refine((files) => files.length > 0, "At least one file is required")
    .refine(
      (files) => files.length <= MAX_FILES,
      `Maximum ${MAX_FILES} files allowed`
    )
    .refine(
      (files) =>
        files.every(
          (file : File) =>
            typeof file?.size === "number" &&
            typeof file?.type === "string" &&
            typeof file?.name === "string"
        ),
      "Invalid file object"
    )
    .refine(
      (files) => files.every((file : File) => file.size <= MAX_FILE_SIZE),
      "Each file must be ≤ 20MB"
    )
    .refine(
      (files) =>
        files.every((file : File) =>
          ALLOWED_MIME_TYPES.includes(file.type)
        ),
      "Only PDF and image files are allowed"
    ),
    owner_type : z.enum(FILE_OWNER_TYPES),
    owner_id : z.string(),
});

export type UploadFilesInputs = z.infer<typeof uploadFilesSchema>;

export const uploadFiles = async ({
  payload,
}: {
  payload: UploadFilesInputs;
}) : Promise<ApiResponse<void>> => {
  const formData = new FormData(); 

  payload.files.forEach((file : File) => {
    formData.append("files", file);
  });
  formData.append("owner_type", payload.owner_type);
  formData.append("owner_id", payload.owner_id);
  console.log(formData);
  
  return api$.post("/files", formData);
};


export const useUplaodFiles = ({
  owner_id,
  owner_type,
  mutationConfig,
}: {
  owner_id: string;
  owner_type: FileOwnerType;
  mutationConfig?: MutationConfig<typeof uploadFiles>;
}) => {
  const qc = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: [FILES_KEY , owner_id , owner_type], exact: false });
      onSuccess?.(...args);
    },

    ...restConfig,
  });
};

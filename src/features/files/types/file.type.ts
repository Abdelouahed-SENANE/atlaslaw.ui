import { Entity } from "@/types/api";

export type FileView = Entity<{
  file_name: string;
  path: string;
  type: string;
  size: number;
}>;

export const FILE_OWNER_TYPES = ["client", "opponent", "party", "user"] as const;
export type FileOwnerType = typeof FILE_OWNER_TYPES[number];



import { Roles } from "@/lib/auth/authorization";

export type BaseEntity = {
  id: string;
  createdAt?: number;
  updatedAt?: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  email: string;
  name: Translation;
  roles: Roles[];
}>;

export type Translation = {
  ar ?: string;
  fr ?: string;
}

export type Jwt = {
  access_token: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
};

export type ApiResponse<T = void> = {
  status: number;
  message: string;
  data?: T | null;
  errors?: Record<string, string>;
  meta?: Metadata;
};

export type Metadata = {
  path?: string;
  method?: string;
  timestamp?: string;
  request_id?: string;
  pagination?: Pagination;
  sorting?: Sorting;
};

type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
};

type Sorting = {
  sort_by: string;
  sort_order: "asc" | "desc";
};

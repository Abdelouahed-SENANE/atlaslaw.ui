import { Permission, Scope } from "@/lib/authorization";

export type BaseEntity = {
  id: string;
  created_at?: number;
  updated_at?: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type User = Entity<{
  email: string;
  name: Translation;
  scope: Scope;
  permissions: Permission[];
}>;

export type Translation = {
  ar?: string;
  fr?: string;
};

export type Jwt = {
  access_token: string;
  token_type?: string;
  refresh_token?: string;
  expires_in?: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  status: number;
  message: string;
  locale?: string;
  timestamp?: string;
  data?: T | null;
  errors?: Record<string, string[]>;
};

// export type Metadata = {
//   path?: string;
//   method?: string;
//   timestamp?: string;
//   request_id?: string;
//   pagination?: Pagination;
//   sorting?: Sorting;
// };

export type Paginated<T> = {
  items: T[];
  pagination?: Pagination;
  sort?: Sorting;
}

type Pagination = {
  total: number;
  page: number;
  limit: number;
  offset: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

type Sorting = {
  sort_by: string;
  sort_order: "asc" | "desc";
};

export type Role = Entity<{
  tenantID: string;
  name: string;
  scope: Scope;
  description: string;
}>;

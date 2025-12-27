export type BaseEntity = {
  id: string;
  created_at?: number;
  updated_at?: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Lang = "ar" | "fr";
export type Translation = Record<Lang, string>;

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

export type Paginated<T> = {
  items: T[];
  pagination?: Pagination;
  sort?: Sorting;
};

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

export type BaseOption = {
  label: string | Translation;
  value: string;
  [key: string]: any;
};

export type Contact = {
  email?: string;
  mobile?: string;
  landline?: string;
  address?: string;
  postal?: string;
};

export type LegalProfile = {
  business_register?: string;
  fiscal_id?: string;
  ice?: string;
  legal_status?: string;
  legal_representative?: string;
  legal_representative_phone?: string;
};


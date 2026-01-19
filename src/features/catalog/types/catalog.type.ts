import { Translation } from "@/types/api";

export type Category = {
  prefix: string;
  label: Translation;
};

export type Code = {
  code: string;
  prefix?: string;
  label: Translation;
  court_type: string;
};

export type Court = {
  code: string;
  label: Translation;
  level: string;
  parent_code?: string;
};

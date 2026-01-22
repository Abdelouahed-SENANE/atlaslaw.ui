import { BaseOption, Entity, Translation } from "@/types/api";

export type CaseDetails = Entity<{
  opening_date: Date;
  client_id: string;
  client_name: Translation;
  opponent_id: string;
  opponent_name: Translation;
  case_manager_id: string;
  case_manager_name: Translation;
  category_id: string;
  category_name: Translation;
  note?: string;
  case_ref: string;
}>;

export type CaseView = Entity<{
  opening_date: Date;
  client_name: Translation;
  opponent_name: Translation;
  created_by: Translation;
  case_manager: Translation;
  category: Translation;
  note?: string;
  case_ref: string;
}>;

export type ProcedureView = Entity<{
  number: number;
  code: number;
  year: number;
  procedure_date: Date;
  criteria: "plaintiff" | "defendant";
  court_id: string;
  court_name: Translation;
  code_parent?: string;
  note?: string;
}>;

export type ProcedureFormView = {
  number: number;
  code: number;
  year: number;
  procedure_date: Date;
  criteria: "plaintiff" | "defendant";
  note?: string;

  court_appeal: string;
  court_primary?: string;
};

export interface CaseOption extends BaseOption {
  id: string;
  case_ref: string;
  client_name: Translation;
  opponent_name: Translation;
}

export interface ProcedureOption extends BaseOption {
  id: string;
  number: string;
  code: string;
  year: string;
}

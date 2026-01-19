import { Entity, Translation } from "@/types/api";

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
  court_name: string;
  note?: string;
}>;
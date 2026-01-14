import { Entity, Translation } from "@/types/api";

export type CaseDetails = Entity<{
  opening_date: Date;
  client_id: string;
  client_name: Translation;
  opponent_id: string;
  opponent_name: Translation;
  case_manager_id: string;
  case_manager_name: Translation;
  code_case_id: string;
  code_case_name: Translation;
  note?: string;
  case_ref: string;
}>;

export type CaseView = Entity<{
  opening_date: Date;
  client_name: Translation;
  opponent_name: Translation;
  created_by: Translation;
  case_manager: Translation;
  code_case: Translation;
  note?: string;
  case_ref: string;
}>;

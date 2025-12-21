import { Entity, Translation } from "@/types/api";

export type PartyType = Entity<{
  name: Translation;
  description: Translation;
  is_active: boolean;
  support_legal_identifiers: boolean;
}>;

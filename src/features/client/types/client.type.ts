import { PartyType } from "@/features/party/party-types/types/party-type";
import { Entity, Translation } from "@/types/api";

export type Client = Entity<{
  name: Translation;
  party_type?: PartyType;
  belongs_to?: Client;
}>;

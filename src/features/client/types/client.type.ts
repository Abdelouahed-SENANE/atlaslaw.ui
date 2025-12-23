import { PartyType } from "@/features/party/party-types/types/party-type";
import { Contact, Entity, LegalProfile, Translation } from "@/types/api";

export type Client = Entity<{
  name: Translation;
  national_id?: string;
  notes?: string;
  parent_id?: string;
  party_type: PartyType;
  contact?: Contact;
  legal_profile?: LegalProfile;
  belongs_to?: Client;
}>;

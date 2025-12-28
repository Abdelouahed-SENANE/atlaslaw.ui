import { PartyTypeOption } from "@/features/party/party-types/types/party-type";
import { Contact, Entity, LegalProfile, Translation } from "@/types/api";

export type OpponentView = Entity<{
  name: Translation;
  national_id?: string;
  notes?: string;
  parent_id?: string;
  opponent_type: Translation;
  contact?: Contact;
  legal_profile?: LegalProfile;
  belongs_to?: OpponentView;
}>;

export type OpponentEditView = {
  id ?: string;
  name: Translation;
  national_id?: string;
  notes?: string;
  parent?: OpponentView;
  party_type: PartyTypeOption;
  contact?: Contact;
  legal_profile?: LegalProfile;
};
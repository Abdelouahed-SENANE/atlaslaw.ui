import { PartyTypeOption } from "@/features/party/party-types/types/party-type";
import { Contact, Entity, LegalProfile, Translation } from "@/types/api";

export type ClientView = Entity<{
  name: Translation;
  national_id?: string;
  notes?: string;
  parent_id?: string;
  client_type: Translation;
  contact?: Contact;
  legal_profile?: LegalProfile;
  belongs_to?: ClientView;
}>;

export type ClientEditView = {
  id?: string;
  name: Translation;
  national_id?: string;
  notes?: string;
  parent?: ClientView;
  party_type: PartyTypeOption;
  contact?: Contact;
  legal_profile?: LegalProfile;
};

export type ClientDetails = {
  id?: string;
  name: Translation;
  national_id?: string;
  notes?: string;
  parent?: ClientProjection;
  children?: ClientProjection[];
  client_type: Translation;
  contact?: Contact;
  legal_profile?: LegalProfile;
};

type ClientProjection = {
  id?: string | null;
  name?: Translation | null;
}
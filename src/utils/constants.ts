import { useTranslation } from "react-i18next";

export const LEGAL_STATUS_OPTIONS = [
  { value: "SARL", label: "clients.fields.legal_profile.legal_status.options.sarl" },
  { value: "SARLU", label: "clients.fields.legal_profile.legal_status.options.sarlu" },
  { value: "AE", label: "clients.fields.legal_profile.legal_status.options.ae" },
  { value: "EI", label: "clients.fields.legal_profile.legal_status.options.ei" },
  { value: "SA", label: "clients.fields.legal_profile.legal_status.options.sa" },
  { value: "SAS", label: "clients.fields.legal_profile.legal_status.options.sas" },
  { value: "SASU", label: "clients.fields.legal_profile.legal_status.options.sasu" },
];

export const useLegalStatusOptions = () => {
  const { t } = useTranslation();

  return LEGAL_STATUS_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.label),
  }));
};

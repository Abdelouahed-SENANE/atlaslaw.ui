import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import i18n from "@/config/i18n";
import { Lang } from "@/types/api";
import {
  Check,
  Copy,
  FileText,
  LocationEdit,
  MessageCircle,
  Phone,
  Scale,
  Smartphone,
  User,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { ClientDetails } from "../types/client.type";

type Props = {
  details: ClientDetails;
};

export const ClientDetailsCards = ({ details }: Props) => {
  const { t } = useTranslation();
  const lang = i18n.language;

  const [copied, setCopied] = React.useState<Record<string, boolean>>({
    email: false,
    mobile: false,
    landline: false,
    business_register: false,
    fiscal_id: false,
  });

  const handelCopy = (key: string, value: string) => {
    if (!value) return;
    try {
      navigator.clipboard.writeText(value);
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 1000);
    } catch (error) {
      console.log("Copied Failed: ", error);
    }
  };
  console.log();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* ================= Base Informations ================= */}
      <Card>
        <CardHeader>
          <h1 className="flex items-center text-xl font-semibold gap-2">
            <span className="bg-blue-400/10 flex items-center justify-center rounded-sm size-10 text-blue-400">
              <FileText className="size-6" />
            </span>{" "}
            {t("clients.cards.base_info.title")}
          </h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1">
            <label className="uppercase">Nom (Français)</label>
            <p className="text-sm">{details.name.fr}</p>
          </div>
          <div className="flex flex-col space-y-1 text-right">
            <label className="uppercase">الاسم (عربي)</label>
            <p className="text-sm">{details.name.ar}</p>
          </div>
          <div className="flex items-center gap-2 space-y-1 ">
            <label className="uppercase">
              {t("clients.cards.base_info.client_type")}:
            </label>
            <p className="text-sm font-semibold bg-primary/10 text-primary w-fit border py-1 px-2 border-border rounded-sm">
              {details.client_type[lang as Lang]}
            </p>
          </div>
          <div className="flex flex-col space-y-1 ">
            <label className="uppercase">
              {t("clients.cards.base_info.note")}
            </label>
            <p className="text-sm border p-2 border-border bg-muted/5 text-foreground/80 rounded-sm">
              {details.notes}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================= Contact Informations ================= */}
      <Card>
        <CardHeader>
          <h1 className="flex items-center text-xl font-semibold gap-2">
            <span className="bg-green-400/10 flex items-center justify-center rounded-sm size-10 text-green-400">
              <Phone className="size-6" />
            </span>
            {t("clients.cards.contact_info.title")}
          </h1>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.contact_info.email")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <MessageCircle className="size-4" />
                </span>
                <p className="text-sm">{details.contact?.email}</p>
              </div>
              <Button
                onClick={() => handelCopy("email", details.contact?.email!)}
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.email ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.contact_info.mobile")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <Smartphone className="size-4" />
                </span>
                <p className="text-sm">{details.contact?.mobile}</p>
              </div>
              <Button
                onClick={() => handelCopy("mobile", details.contact?.mobile!)}
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.mobile ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.contact_info.landline")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <Phone className="size-4" />
                </span>
                <p className="text-sm">{details.contact?.landline}</p>
              </div>
              <Button
                onClick={() =>
                  handelCopy("landline", details.contact?.landline!)
                }
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.landline ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.contact_info.address")}
            </label>
            <div className="bg-input/20 border border-border flex-col  p-2 items-center  rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <LocationEdit className="size-4" />
                </span>
                <p className="text-sm">{details.contact?.address}</p>
              </div>
              <span className="text-foreground/80">
                code postale: {details.contact?.postal}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= Legal Informations ================= */}
      <Card className="col-span-2">
        <CardHeader>
          <h1 className="flex items-center text-xl font-semibold gap-2">
            <span className="bg-blue-400/10 flex items-center justify-center rounded-sm size-10 text-blue-400">
              <Scale className="size-6" />
            </span>
            {t("clients.cards.legal_info.title")}
          </h1>
        </CardHeader>
        <CardContent className="space-y-2 grid grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.business_register")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <p className="text-sm">
                  {details.legal_profile?.business_register}
                </p>
              </div>
              <Button
                onClick={() =>
                  handelCopy(
                    "business_register",
                    details.legal_profile?.business_register!
                  )
                }
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.business_register ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.fiscal_id")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <p className="text-sm">{details.legal_profile?.fiscal_id}</p>
              </div>
              <Button
                onClick={() =>
                  handelCopy("fiscal_id", details.legal_profile?.fiscal_id!)
                }
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.fiscal_id ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.ice")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <p className="text-sm">{details.legal_profile?.ice}</p>
              </div>
              <Button
                onClick={() => handelCopy("ice", details.legal_profile?.ice!)}
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.ice ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.legal_representative")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <User className="size-4" />
                </span>
                <p className="text-sm">
                  {details.legal_profile?.legal_representative}
                </p>
              </div>
              <Button
                onClick={() =>
                  handelCopy(
                    "legal_representative",
                    details.legal_profile?.legal_representative!
                  )
                }
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.legal_representative ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.legal_representative_phone")}
            </label>
            <div className="bg-input/20 border border-border flex h-10 p-2 items-center justify-between rounded-sm  ">
              <div className="flex items-center gap-1">
                <span>
                  <Phone className="size-4" />
                </span>
                <p className="text-sm">
                  {details.legal_profile?.legal_representative_phone}
                </p>
              </div>
              <Button
                onClick={() =>
                  handelCopy(
                    "legal_representative_phone",
                    details.legal_profile?.legal_representative_phone!
                  )
                }
                variant={"plain"}
                size={"icon"}
                className="hover:text-primary p-1"
              >
                {copied.legal_representative_phone ? (
                  <span className="text-primary">
                    <Check className="size-4" />
                  </span>
                ) : (
                  <span>
                    <Copy className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="uppercase">
              {t("clients.cards.legal_info.legal_status")}
            </label>
            <div className="bg-input/20 border border-border h-10 p-2  rounded-sm  ">
              <div className="flex items-center gap-1">
                <p className="text-sm">
                  {details.legal_profile?.legal_status}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

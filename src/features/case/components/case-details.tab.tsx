import { Card, CardContent, CardHeader } from "@/components/ui/card";
import i18n from "@/config/i18n";
import { Lang } from "@/types/api";
import { Briefcase, Calendar, FileText, Info, User, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CaseDetails } from "../types/case.type";

type Props = {
  details: CaseDetails;
};

export const CaseDetailsTab = ({ details }: Props) => {
  const { t } = useTranslation();
  const lang = i18n.language;
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-0 col-span-2 gap-2 ">
        <CardHeader className="p-4 flex items-center [.border-b]:pb-4  border-b ">
          <span className="size-12 flex items-center justify-center bg-primary/12 border border-primary/30 rounded-sm">
            <Users className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.title_parties")}
            </h1>
            <p className="text-sm text-foreground/70">
              {t("cases.pages.view.desc_parties")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-linear-90 from-primary/10 p-2 border basis-1/2 border-primary/15 to-transparent rounded-sm flex items-sdtart gap-2">
            <span className="size-10 flex items-center justify-center text-primary">
              <User />
            </span>
            <div>
              <h4 className="text-foreground/90 text-lg">
                {t("cases.pages.view.title_client")}
              </h4>
              <h2 className="text-2xl text-primary">
                {details.client_name[lang as Lang]}
              </h2>
            </div>
          </div>
          <div className="bg-linear-90 from-primary/10 p-2 border basis-1/2 border-primary/15 to-transparent rounded-sm flex items-sdtart gap-2">
            <span className="size-10 flex items-center justify-center text-primary">
              <User />
            </span>
            <div>
              <h4 className="text-foreground/90 text-lg">
                {t("cases.pages.view.title_opponent")}
              </h4>
              <h2 className="text-2xl text-primary">
                {details.opponent_name[lang as Lang]}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 col-span-1 gap-2 ">
        <CardHeader className="p-4 flex items-center [.border-b]:pb-4  border-b ">
          <span className="size-12 flex items-center justify-center bg-primary/12 border border-primary/30 rounded-sm">
            <Briefcase className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.title_type_case")}
            </h1>
            <p className="text-sm text-foreground/70">
              {t("cases.pages.view.classification")}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4  gap-4">
          <div className="bg-background/20 border border-border  p-2   rounded-sm flex items-sdtart gap-2">
            <span className="size-10 flex items-center justify-center text-forground/80">
              <FileText />
            </span>
            <div>
              <h4 className="text-foreground/90 text-lg">
                {t("cases.pages.view.type_case")}
              </h4>
              <h2 className="text-2xl text-card-foreground">
                {details.category_name[lang as Lang]}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 col-span-1 gap-2 ">
        <CardHeader className="p-4 flex items-center [.border-b]:pb-4  border-b ">
          <span className="size-12 flex items-center justify-center bg-primary/12 border border-primary/30 rounded-sm">
            <Calendar className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.opening_date")}
            </h1>
          </div>
        </CardHeader>
        <CardContent className="p-4  gap-4">
          <div className=" rounded-sm flex items-start gap-2">
            <h2 className="text-2xl text-primary">
              {details.opening_date.toString()}
            </h2>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 col-span-1 gap-2 ">
        <CardHeader className="p-4 flex items-center [.border-b]:pb-4  border-b ">
          <span className="size-12 flex items-center justify-center bg-primary/12 border border-primary/30 rounded-sm">
            <User className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.case_manager")}
            </h1>
          </div>
        </CardHeader>
        <CardContent className="p-4  gap-4">
          <div className=" rounded-sm flex items-start gap-2">
            <h2 className="text-2xl text-card-foreground">
              {details.case_manager_name[lang as Lang]}
            </h2>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 col-span-1 gap-2 row-span-2 ">
        <CardHeader className="p-4 flex items-center [.border-b]:pb-4  border-b ">
          <span className="size-12 flex items-center justify-center bg-primary/12 border border-primary/30 rounded-sm">
            <User className="size-5 text-primary" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.title_audit")}
            </h1>
          </div>
        </CardHeader>
        <CardContent className="p-4  gap-4">
          <div className="rounded-sm bg-background/40 border border-border p-3 flex items-start flex-col gap-2">
            <h4 className="text-foreground/90 text-lg">
              {t("cases.pages.view.created_at")}
            </h4>
            <h2 className="text-2xl text-card-foreground">
              {details.created_at?.toString()}
            </h2>
          </div>
          <div className="rounded-sm bg-background/40 border border-border p-3 flex items-start flex-col gap-2">
            <h4 className="text-foreground/90 text-lg">
              {t("cases.pages.view.updated_at")}
            </h4>
            <h2 className="text-2xl text-card-foreground">
              {details.updated_at?.toString()}
            </h2>
          </div>
        </CardContent>
      </Card>

      <Card className="p-0 col-span-2 gap-0">
        <CardHeader className="p-4 flex items-center  ">
          <span className="size-12 flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 rounded-sm">
            <Info className="size-5 text-yellow-500" />
          </span>
          <div>
            <h1 className="text-lg font-semibold">
              {t("cases.pages.view.note")}
            </h1>
          </div>
        </CardHeader>
        <CardContent className="pl-18  pb-4  ">
          <p className="text-xl  text-card-foreground/90">{details.note}</p>
        </CardContent>
      </Card>
    </div>
  );
};

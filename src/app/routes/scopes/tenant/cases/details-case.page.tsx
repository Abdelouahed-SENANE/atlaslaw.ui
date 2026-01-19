import { DashLayout } from "@/components/layouts/_dash-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paths } from "@/config/paths";
import { useCaseDetails } from "@/features/case/api/case-details";
import { CaseDetailsTab } from "@/features/case/components/case-details.tab";
import { CaseDocumentTab } from "@/features/case/components/case-document.tab";
import { CaseProceduresTab } from "@/features/case/components/case-procedures.tab";
import { Check, Copy, FileText, Hash, Info, Workflow } from "lucide-react";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const CaseDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  if (!id) {
    navigate(paths.tenant.cases.list.route());
  }

  const caseQuery = useCaseDetails({
    id: id!,
    queryConfig: { enabled: !!id },
  });

  const details = caseQuery.data?.data;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.cases"),
      url: paths.tenant.cases.list.route(),
      active: false,
    },
    {
      label: t("cases.pages.view.title"),
      url: "#",
      active: true,
    },
  ];
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const handelCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(details?.case_ref || "");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      setIsCopied(false);
    }
  }, [details?.case_ref]);
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("cases.pages.view.title")}
      desc={t("cases.pages.view.description")}
    >
      <div className="bg-linear-to-br from-primary/15 flex gap-3 via-primary/5 to-transparent border border-primary/50 p-4 mb-4 rounded-md">
        <span className="size-8 bg-primary/20 flex items-center justify-center rounded-sm">
          <Hash className="size-5 text-primary" />
        </span>
        <div className="w-full">
          <div className="flex flex-1 items-start justify-between ">
            <h4 className="text-xl text-foreground/60">
              {t("cases.pages.view.case_ref")}
            </h4>
            <Button onClick={handelCopy} className="size-10 rounded-md">
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <h1 className="text-3xl">{details?.case_ref}</h1>
        </div>
      </div>
      <Tabs defaultValue="info">
        <TabsList className="bg-card border border-border p-1 h-11">
          <TabsTrigger value="info">
            <Info className="size-4" />
            {t("cases.pages.view.info")}
          </TabsTrigger>
          <TabsTrigger value="procedures">
            <Workflow className="size-4" />
            {t("cases.pages.view.procedures")}
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <FileText className="size-4" />
            {t("cases.pages.view.attachments")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          {caseQuery.isLoading ? (
            <div>Loading...</div>
          ) : (
            <CaseDetailsTab details={details!} />
          )}
        </TabsContent>
        <TabsContent value="procedures">
          {caseQuery.isLoading ? (
            <div>Loading...</div>
          ) : (
            <CaseProceduresTab
              caseId={details?.id ?? ""}
              prefix={details?.category_id!}
            />
          )}
        </TabsContent>
        <TabsContent value="attachments">
          <CaseDocumentTab caseId={id!} />
        </TabsContent>
      </Tabs>
    </DashLayout>
  );
};

export default CaseDetailsPage;

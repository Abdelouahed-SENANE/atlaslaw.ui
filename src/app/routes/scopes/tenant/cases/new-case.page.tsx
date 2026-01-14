import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateCaseInputs,
  useCreateCase,
} from "@/features/case/api/create-case";
import { CaseForm } from "@/features/case/components/case.form";
import { Logger } from "@/utils/logger";
import React from "react";
// import { CreateCaseInputs, useCreateCase } from "@/features/client/api/create-client";
// import { CaseForm } from "@/features/client/components/client.form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewCasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateCaseInputs, string[]>>
  >({});
  const createCase = useCreateCase({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("cases.toast.created_title"),
          description: t("cases.toast.created_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        Logger.error(error);
        if (error.response.status !== 422) {
          setApiErrors(error.response.data.errors);
        }
        if (error.response.status === 500) {
          toast({
            title: t("cases.toast.error_create_title"),
            description: "Internal server error",
            type: "error",
          });
        }
      },
    },
  });
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
      label: t("cases.pages.new.title"),
      url: "#",
      active: true,
    },
  ];
  const handleOnsubmit = (values: CreateCaseInputs) => {
    if (!values) return;
    createCase.mutate({ payload: values });
  };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("cases.pages.new.title")}
      desc={t("cases.pages.new.description")}
    >
      <CaseForm
        mode="create"
        onSubmit={handleOnsubmit}
        isLoading={false}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default NewCasePage;

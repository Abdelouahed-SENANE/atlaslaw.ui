import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useCaseDetails } from "@/features/case/api/case-details";
import { useUpdateCase } from "@/features/case/api/update-case";
import { CaseForm, CaseFormInputs } from "@/features/case/components/case.form";
import { CaseDetails } from "@/features/case/types/case.type";
import { Logger } from "@/utils/logger";
import React from "react";
// import { CreateCaseInputs, useCreateCase } from "@/features/client/api/create-client";
// import { CaseForm } from "@/features/client/components/client.form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditCasePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const details = useCaseDetails({
    id: id!,
    queryConfig: { enabled: !!id },
  });
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CaseFormInputs, string[]>>
  >({});
  const updateCase = useUpdateCase({
    id: id!,
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("cases.toast.updated_title"),
          description: t("cases.toast.updated_desc"),
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
            title: t("cases.toast.error_update_title"),
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
      label: t("cases.pages.update.title"),
      url: "#",
      active: true,
    },
  ];
  const handleOnsubmit = (values: CaseFormInputs) => {
    console.log(values);
    
    if (!values) return;
    updateCase.mutate({ id: id!, payload: values });
  };

  const defaults = details.data?.data;
  console.log("[DEFAULT]" , defaults);
  
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("cases.pages.edit.title")}
      desc={t("cases.pages.edit.description")}
    >
      {details.isLoading ? (
        <div>Loading...</div>
      ) : (
        <CaseForm
          defaultValues={defaults ?? ({} as CaseDetails)}
          mode="update"
          onSubmit={handleOnsubmit}
          isLoading={false}
          apiErrors={apiErrors}
        />
      )}
    </DashLayout>
  );
};

export default EditCasePage;

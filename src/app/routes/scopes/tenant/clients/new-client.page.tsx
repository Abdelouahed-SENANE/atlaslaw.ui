import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { CreateClientInputs, useCreateClient } from "@/features/client/api/create-client";
import { ClientForm } from "@/features/client/components/client.form";
import { Logger } from "@/utils/logger";
import React from "react";
// import {
//   CreateClientInputs,
//   useCreateClient,
// } from "@/features/employee/api/create-employee";
// import { ClientForm } from "@/features/employee/components/employee.form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewClientPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
    const [apiErrors, setApiErrors] = React.useState<
      Partial<Record<keyof CreateClientInputs, string[]>>
    >({});
    const createClient = useCreateClient({
      mutationConfig: {
        onSuccess: () => {
          setApiErrors({});
          toast({
            title: t("clients.toast.created_title"),
            description: t("clients.toast.created_desc"),
            type: "success",
          });
          navigate(-1);
        },
        onError: (error: any) => {
          Logger.error(error);
          setApiErrors(error.response.data.errors);
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
      label: t("menu.clients"),
      url: paths.tenant.clients.list.route(),
      active: false,
    },
    {
      label: t("clients.pages.new.title"),
      url: "#",
      active: true,
    },
  ];
    const handleOnsubmit = (values: CreateClientInputs) => {
      createClient.mutate({ payload: values });
    };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("clients.pages.new.title")}
      desc={t("clients.pages.new.description")}
    >
      
      <ClientForm
        mode="create"
        onSubmit={handleOnsubmit}
        isLoading={false}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default NewClientPage;

import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useClientForEdit } from "@/features/client/api/client-details-edit";
import { CreateClientInputs } from "@/features/client/api/create-client";
import { useUpdateClient } from "@/features/client/api/update-client";
import { ClientForm } from "@/features/client/components/client.form";
import { ClientFormSkeleton } from "@/features/client/components/client.form-sekelton";
import { ClientEditView } from "@/features/client/types/client.type";
import { Logger } from "@/utils/logger";
import React from "react";
// import {
//   CreateClientInputs,
//   useCreateClient,
// } from "@/features/employee/api/create-employee";
// import { ClientForm } from "@/features/employee/components/employee.form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditClientPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateClientInputs, string[]>>
  >({});
  const { id } = useParams();
  
  if (!id) {
    navigate(paths.tenant.clients.list.route());
  }

  const clientQuery = useClientForEdit({
    id: id!,
    queryConfig: { enabled: !!id },
  });
  const updateClient = useUpdateClient({
    id: id!,
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("clients.toast.updated_title"),
          description: t("clients.toast.updated_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        Logger.error(error);
        if (error.response?.status === 422) {
          setApiErrors(error.response.data.errors);
        }
        toast({
          title: t("clients.toast.error_update_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });

  const defaultValues = clientQuery.data?.data;
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
      updateClient.mutate({ id: id!,payload: values });
    };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("clients.pages.new.title")}
      desc={t("clients.pages.new.description")}
    >
      {clientQuery.isLoading ? (
        <ClientFormSkeleton />
      ) : (
              <ClientForm
        mode="update"
        defaultValues={defaultValues as Partial<ClientEditView>}
        onSubmit={handleOnsubmit}
        isLoading={false}
        apiErrors={apiErrors}
      />
      )}
    </DashLayout>
  );
};

export default EditClientPage;

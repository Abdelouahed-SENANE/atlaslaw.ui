

import { DashLayout } from "@/components/layouts/_dash-layout";
import { paths } from "@/config/paths";
// import {
//   CreateClientInputs,
//   useCreateClient,
// } from "@/features/employee/api/create-employee";
// import { ClientForm } from "@/features/employee/components/employee.form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ClientsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  //   const [apiErrors, setApiErrors] = React.useState<
  //     Partial<Record<keyof CreateClientInputs, string[]>>
  //   >({});
  //   const createClient = useCreateClient({
  //     mutationConfig: {
  //       onSuccess: () => {
  //         setApiErrors({});
  //         toast({
  //           title: t("employees.toast.created_title"),
  //           description: t("employees.toast.created_desc"),
  //           type: "success",
  //         });
  //         navigate(-1);
  //       },
  //       onError: (error: any) => {
  //         Logger.error(error);
  //         setApiErrors(error.response.data.errors);
  //       },
  //     },
  //   });
  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.employees"),
      url: paths.tenant.employees.list.route(),
      active: false,
    },
    {
      label: t("employees.pages.new.title"),
      url: "#",
      active: true,
    },
  ];
  //   const handleOnsubmit = (values: CreateClientInputs) => {
  //     createClient.mutate({ payload: values });
  //   };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("employees.pages.new.title")}
      desc={t("employees.pages.new.description")}
    >
      <div>New Client</div>
      {/* <ClientForm
        mode="create"
        onSubmit={handleOnsubmit}
        isLoading={createClient.isPending}
        apiErrors={apiErrors}
      /> */}
    </DashLayout>
  );
};

export default ClientsPage;

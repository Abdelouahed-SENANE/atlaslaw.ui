import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateEmployeeInputs,
  useCreateEmployee,
} from "@/features/employee/api/create-employee";
import { EmployeeForm } from "@/features/employee/components/employee.form";
import { Logger } from "@/utils/logger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewEmployeePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateEmployeeInputs, string[]>>
  >({});
  const createEmployee = useCreateEmployee({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("employees.toast.created_title"),
          description: t("employees.toast.created_desc"),
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
  const handleOnsubmit = (values: CreateEmployeeInputs) => {
    createEmployee.mutate({ payload: values });
  };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("employees.pages.new.title")}
      desc={t("employees.pages.new.description")}
    >
      <EmployeeForm
        mode="create"
        onSubmit={handleOnsubmit}
        isLoading={createEmployee.isPending}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default NewEmployeePage;

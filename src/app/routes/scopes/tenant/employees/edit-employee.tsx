import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useEmployee } from "@/features/employee/api/employee-details";
import {
  UpdateEmployeeInputs,
  useUpdateEmployee,
} from "@/features/employee/api/update-employee";
import { EmployeeForm } from "@/features/employee/components/employee-form";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployeePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof UpdateEmployeeInputs, string[]>>
  >({});

  const { id } = useParams();

  const empQuery = useEmployee({
    id: id ?? "",
    queryConfig: { enabled: !!id },
  });

  const updateEmployee = useUpdateEmployee({
    id: id ?? "",
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("employees.toast.updated_title"),
          description: t("employees.toast.updated_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        if (error.response?.status === 422) {
          setApiErrors(error.response.data.errors);
        }
        toast({
          title: t("employees.toast.error_update_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });

  // ❗ SAFE RETURNS — AFTER HOOKS
  if (!id) return <div>Invalid tenant ID</div>;
  if (empQuery.isLoading) return <div>Loading...</div>;
  if (!empQuery.data?.data) return <div>No tenant found</div>;

  const employee = empQuery.data?.data;
console.log("hiring_date:", employee.hiring_date, typeof employee.hiring_date);
  const breadcrumbs = [
    {
      label: "Dashboard",
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: "Employees",
      url: paths.tenant.employees.route(),
      active: false,
    },
    {
      label: t("employees.pages.edit.title"),
      url: "#",
      active: true,
    },
  ];

  const handleSubmit = (values: UpdateEmployeeInputs) => {
    const changed: Partial<UpdateEmployeeInputs> = {};
    if (values.job_title !== employee.job_title)
      changed.job_title = values.job_title;
    if (values.status !== employee.status) changed.status = values.status;
    if (values.hiring_date !== employee.hiring_date)
      changed.hiring_date = values.hiring_date;
    if (values.work_phone !== employee.work_phone)
      changed.work_phone = values.work_phone;
    if (Object.keys(changed).length === 0) {
      toast({
        title: t("employees.toast.no_changes_title"),
        description: t("employees.toast.no_changes_desc"),
        type: "info",
      });
      return;
    }
    updateEmployee.mutate({
      id: id!,
      payload: values,
    });
  };

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("employees.pages.edit.title")}
      desc={t("employees.pages.edit.description")}
    >
      <EmployeeForm
        mode="update"
        key={employee.id}
        apiErrors={apiErrors}
        defaultValues={employee}
        onSubmit={handleSubmit}
        isLoading={updateEmployee.isPending}
      />
    </DashLayout>
  );
};

export default EditEmployeePage;

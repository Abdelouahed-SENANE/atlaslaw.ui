import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { CreateRoleInputs } from "@/features/rbac/api/create-role";
import { useRole } from "@/features/rbac/api/role-details";
import { useUpdateRole } from "@/features/rbac/api/update-role";
import { RoleForm } from "@/features/rbac/components/role-form";
import { Role } from "@/features/rbac/types";
import { Logger } from "@/utils/logger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
const EditRolePage = () => {
  const { id } = useParams();
  const roleQuery = useRole({ id: id!, queryConfig: { enabled: !!id } });

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof Role, string[]>>
  >({});

  const updateRole = useUpdateRole({
    id: id!,
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("roles.toast.updated_title"),
          description: t("roles.toast.updated_desc"),
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

  if (roleQuery.isLoading) return null;

  const role = roleQuery.data?.data;

  const handleOnsubmit = (values: CreateRoleInputs) => {
    updateRole.mutate({ id: id!, payload: values });
  };
  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.rbac"),
      url: paths.admin.rbac.roles.list.route(),
      active: false,
    },
    {
      label: `${t("roles.page.update_title")} - ${role?.name}`,
      url: "#",
      active: true,
    },
  ];
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("roles.page.update_title")}
      desc={t("roles.page.update_desc")}
    >
      <RoleForm
        defaultValues={role ?? undefined}
        onSubmit={handleOnsubmit}
        isLoading={updateRole.isPending}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default EditRolePage;

import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateRoleInputs,
  useCreateRole,
} from "@/features/access-control/api/create-role";
import { RoleForm } from "@/features/access-control/components/role-form";
import { Logger } from "@/utils/logger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewRolePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateRoleInputs, string[]>>
  >({});
  const createRole = useCreateRole({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("roles.toast.created_title"),
          description: t("roles.toast.created_desc"),
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
      label: t("menu.rbac"),
      url: paths.admin.rbac.roles.list.route(),
      active: false,
    },
    {
      label: t("roles.page.create_title"),
      url: "#",
      active: true,
    },
  ];
  const handleOnsubmit = (values: CreateRoleInputs) => {
    createRole.mutate({ payload: values });
  };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("roles.page.create_title")}
      desc={t("roles.page.create_desc")}
    >
      <RoleForm
        onSubmit={handleOnsubmit}
        isLoading={createRole.isPending}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default NewRolePage;

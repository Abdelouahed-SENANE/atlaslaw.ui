import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import {
  CreateRoleInputs,
  useCreateRole,
} from "@/features/rbac/api/create-role";
import { RoleForm } from "@/features/rbac/components/role-form";
import { Role } from "@/types/api";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewRolePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof Role, string[]>>
  >({});
  const createRole = useCreateRole({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("roles.title.created"),
          description: t("roles.description.created"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        setApiErrors(error.response.data.errors);
      },
    },
  });
  const handleOnsubmit = (values: CreateRoleInputs) => {
    createRole.mutate({ payload: values });
  };
  return (
    <DashLayout
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

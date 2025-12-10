import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import {
  CreateTenantInputs,
  useCreateTenant,
} from "@/features/tenant/api/create-tenant";
import { TenantForm } from "@/features/tenant/components/tenant-form";
import { Authorization, PermissionCode } from "@/lib/authorization";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewTenantPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateTenantInputs, string[]>>
  >({});

  const createTenant = useCreateTenant({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("tenants.toast.created_title"),
          description: t("tenants.toast.created_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        if (error.response.status === 422) {
          setApiErrors(error.response.data.errors);
        }
        setApiErrors({});
        toast({
          title: t("tenants.toast.error_create_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });
  const breadcrumps = [
    {
      label: "Dashboard",
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: "Tenants",
      url: paths.admin.tenants.route(),
      active: false,
    },
    {
      label: t("tenants.pages.new.title"),
      url: "#",
      active: true,
    },
  ];

  const handleSubmit = (payload: CreateTenantInputs) => {
    createTenant.mutate({ payload });
  };
  return (
    <Authorization permission={PermissionCode.CREATE_TENANTS}>
      <DashLayout
        breadcrumbs={breadcrumps}
        title={t("tenants.pages.new.title")}
        desc={t("tenants.pages.new.description")}
      >
        <TenantForm apiErrors={apiErrors} onSubmit={handleSubmit} />
      </DashLayout>
    </Authorization>
  );
};
export default NewTenantPage;

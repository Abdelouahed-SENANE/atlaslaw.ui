import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { CreateTenantInputs } from "@/features/tenant/api/create-tenant";
import { useTenant } from "@/features/tenant/api/tenant-details";
import {
  UpdateTenantInputs,
  useUpdateTenant,
} from "@/features/tenant/api/update-tenant";
import { TenantForm } from "@/features/tenant/components/tenant-form";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditTenantPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateTenantInputs, string[]>>
  >({});

  const { id } = useParams();

  // ❗ ALWAYS CALL HOOKS — NEVER RETURN BEFORE THIS
  const tenantQuery = useTenant({
    id: id ?? "",
    queryConfig: { enabled: !!id },
  });

  const updateTenant = useUpdateTenant({
    id: id ?? "",
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("tenants.toast.updated_title"),
          description: t("tenants.toast.updated_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        if (error.response?.status === 422) {
          setApiErrors(error.response.data.errors);
        }
        toast({
          title: t("tenants.toast.error_update_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });

  // ❗ SAFE RETURNS — AFTER HOOKS
  if (!id) return <div>Invalid tenant ID</div>;
  if (tenantQuery.isLoading) return <div>Loading...</div>;
  if (!tenantQuery.data?.data) return <div>No tenant found</div>;

  const tenant = tenantQuery.data?.data;

  const breadcrumbs = [
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
      label: t("tenants.pages.edit.title"),
      url: "#",
      active: true,
    },
  ];

  const handleSubmit = (values: CreateTenantInputs) => {
    const changed: Partial<UpdateTenantInputs> = {};
    if (values.name !== tenant.name) changed.name = values.name;
    if (values.slug !== tenant.slug) changed.slug = values.slug;
    if (values.status !== tenant.status) changed.status = values.status;
    if (values.owner_id !== tenant.owner.id) changed.owner_id = values.owner_id;
    if (Object.keys(changed).length === 0) {
      toast({
        title: t("tenants.toast.no_changes_title"),
        description: t("tenants.toast.no_changes_desc"),
        type: "info",
      });
      return;
    }
    updateTenant.mutate({
      id: id!,
      payload: values,
    });
  };

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("tenants.pages.edit.title")}
      desc={t("tenants.pages.edit.description")}
    >
      <TenantForm
        key={tenant.id}
        apiErrors={apiErrors}
        defaultValues={tenant}
        onSubmit={handleSubmit}
        isLoading={updateTenant.isPending}
      />
    </DashLayout>
  );
};

export default EditTenantPage;

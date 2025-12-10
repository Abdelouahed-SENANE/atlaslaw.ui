import { DashLayout } from "@/components/layouts/_dash-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useRolePermissions } from "@/features/access-control/api/get-role-permissions";
import { RolePermissionsMatrix } from "@/features/access-control/components/role-permissions-matrix";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const RolePermissionsPage = () => {
  const { id } = useParams();
  if (!id) return null;

  const rolePerms = useRolePermissions({ id });

  const role = rolePerms.data?.data?.role;
  const groups = rolePerms.data?.data?.groups ?? {};
  const { t } = useTranslation();


  if (rolePerms.isLoading) return null;

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
      label: `${t("roles.page.permissions_title")} - ${role?.name}`,
      url: "#",
      active: true,
    },
  ];

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("roles.page.permissions_title")}
      desc={t("roles.page.permissions_desc")}
    >
      <Card className="rounded-md shadow-none border border-border p-3">
        <CardHeader className="p-0">
          <CardTitle>
            {t("roles.page.role_permissions_title")} {role?.name}
          </CardTitle>
          <CardDescription className="text-card-foreground/70">
            {t("roles.page.role_permissions_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <RolePermissionsMatrix roleID={id} groups={groups} />
        </CardContent>
      </Card>
    </DashLayout>
  );
};

export default RolePermissionsPage;

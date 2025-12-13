import { DashLayout } from "@/components/layouts/_dash-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchInput } from "@/components/ui/form";
import { RouterLink } from "@/components/ui/link";
import { QuickAction } from "@/components/ui/quick-actions";
import { TablePagination, useQueryTable } from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useRoles } from "@/features/access-control/api/list-roles";
import { RoleTable } from "@/features/access-control/components/role-table";
import { Role } from "@/features/access-control/types";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Pen, Plus, Shield, Trash } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ListRolesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<Role>();
  const rolesQuery = useRoles({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = rolesQuery.data?.data?.items ?? [];
  const pagination = rolesQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_roles"),
      url: "#",
      active: true,
    },
  ];

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "edit":
        navigate(paths.tenant.roles.edit.route(id));
        break;
      case "manage_permissions":
        navigate(paths.tenant.roles.permissions.route(id));
        break;
      default:
        break;
    }
  }, []);

  const actions = useMemo<QuickAction[]>(
    () =>
      [
        {
          label: t("roles.actions.edit"),
          value: "edit",
          icon: <Pen className="h-4 w-4 text-foreground" />,
          permission: PermissionCode.UPDATE_ROLES,
        },
        {
          label: t("roles.actions.manage_permissions"),
          value: "manage_permissions",
          icon: <Shield className="h-4 w-4 text-foreground" />,
          permission: PermissionCode.UPDATE_ROLES,
        },
        {
          label: t("roles.actions.delete"),
          value: "delete",
          icon: <Trash className="h-4 w-4 text-foreground" />,
          permission: PermissionCode.DELETE_ROLES,
        },
      ] as const,
    [t]
  );

  const filteredActions = useMemo(() => {
    return actions.filter((a) => hasPermission({ permission: a.permission }));
  }, [actions, hasPermission]);

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("roles.page.title")}
      desc={t("roles.page.desc")}
    >
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <div>
            <CardTitle>{t("roles.page.list_title")}</CardTitle>
            <CardDescription className="text-sm text-card-foreground/70">
              {t("roles.page.list_desc")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              className="min-w-90"
              placeholder={t("roles.page.search")}
              onChange={(val) => table.setQuery(val)}
              value={table.query}
              delay={600}
            />
            {hasPermission({ permission: PermissionCode.CREATE_ROLES }) && (
              <Button>
                <RouterLink
                  className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                  to={paths.tenant.roles.new.route()}
                >
                  <Plus className="size-4" />
                  <span>{t("roles.page.add")}</span>
                </RouterLink>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RoleTable
            roles={items}
            isLoading={rolesQuery.isLoading}
            table={table}
            actions={filteredActions}
            onAction={handleAction}
          />
        </CardContent>
      </Card>

      <div>
        {pagination && (
          <TablePagination
            page={pagination.page}
            total={pagination.total}
            limit={pagination.limit}
            rootUrl="/roles"
          />
        )}
      </div>
    </DashLayout>
  );
};

export default ListRolesPage;

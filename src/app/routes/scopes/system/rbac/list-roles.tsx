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
import { TablePagination, useQueryTable } from "@/components/ui/table";
import { paths } from "@/config/paths";
import { useRoles } from "@/features/rbac/api/list-roles";
import { RoleTable } from "@/features/rbac/components/role-table";
import { Role } from "@/features/rbac/types";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const ListRolesPage = () => {
  const { t } = useTranslation();

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
            <Button>
              <RouterLink
                className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                to={paths.admin.rbac.roles.new.route()}
              >
                <Plus className="size-4" />
                <span>{t("roles.page.add")}</span>
              </RouterLink>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RoleTable
            roles={items}
            isLoading={rolesQuery.isLoading}
            table={table}
          />
        </CardContent>
      </Card>

      <div>
        {pagination && (
          <TablePagination
            page={pagination.page}
            total={pagination.total}
            limit={pagination.limit}
            rootUrl="/admin/rbac/roles"
          />
        )}
      </div>
    </DashLayout>
  );
};

export default ListRolesPage;

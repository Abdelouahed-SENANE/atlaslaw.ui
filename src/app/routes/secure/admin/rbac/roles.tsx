import { DashLayout } from "@/components/layouts/_dash-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SearchInput } from "@/components/ui/form";
import { TablePagination } from "@/components/ui/table";
import { useTable } from "@/components/ui/table/use-table";
import { useRoles } from "@/features/rbac/api/get-roles";
import { RoleTable } from "@/features/rbac/components/role-table";
import { Role } from "@/types/api";
import { useTranslation } from "react-i18next";

const RolesPage = () => {
  const { t } = useTranslation();

  const table = useTable<Role>();
  const rolesQuery = useRoles({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = rolesQuery.data?.data?.items ?? [];
  const pagination = rolesQuery.data?.data?.pagination;

  return (
    <DashLayout title={t("roles.page.title")} desc={t("roles.page.desc")}>
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <CardDescription>
            <h3 className="text-lg font-bold text-card-foreground">
              {t("roles.page.list_title")}
            </h3>
            <p className="text-sm text-card-foreground/70">
              {t("roles.page.list_desc")}
            </p>
          </CardDescription>
          <SearchInput
            placeholder={t("roles.page.search")}
            className="w-1/4"
            onChange={(val) => table.setQuery(val)}
            value={table.query}
          />
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

export default RolesPage;

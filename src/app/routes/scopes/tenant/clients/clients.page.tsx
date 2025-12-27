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
import { useClients } from "@/features/client/api/list-client";
import { ClientTable } from "@/features/client/components/client.table";
import { ClientView } from "@/features/client/types/client.type";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const ClientsPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<ClientView>();
  const clientsQuery = useClients({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = clientsQuery.data?.data?.items ?? [];
  const pagination = clientsQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_clients"),
      url: "#",
      active: true,
    },
  ];

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("clients.pages.list.title")}
      desc={t("clients.pages.list.desc")}
    >
      <>
        <Card className="p-2">
          <CardHeader className="flex items-center justify-between p-0">
            <div>
              <CardTitle>{t("clients.pages.list.subtitle")}</CardTitle>
              <CardDescription className="text-sm text-card-foreground/70">
                {t("clients.pages.list.sub_desc")}
              </CardDescription>
            </div>
            <div
              data-slot="filters "
              className="flex items-center  justify-between gap-2"
            >
              <SearchInput
                className="min-w-90"
                placeholder={t("clients.actions.search")}
                onChange={(val) => table.setQuery(val)}
                value={table.query}
                delay={600}
              />
              {hasPermission({
                permission: PermissionCode.CREATE_EMPLOYEES,
              }) && (
                <Button>
                  <RouterLink
                    className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                    to={paths.tenant.clients.new.route()}
                  >
                    <Plus className="size-4" />
                    <span>{t("clients.actions.add")}</span>
                  </RouterLink>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <ClientTable
              clients={items}
              table={table}
              isLoading={clientsQuery.isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {pagination && (
            <TablePagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              rootUrl="/clients"
            />
          )}
        </div>
      </>
    </DashLayout>
  );
};
export default ClientsPage;

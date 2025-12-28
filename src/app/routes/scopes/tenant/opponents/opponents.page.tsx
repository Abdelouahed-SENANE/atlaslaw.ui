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
import { useOpponents } from "@/features/opponent/api/list-opponent";
import { OpponentView } from "@/features/opponent/types/opponent.type";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OpponentTable } from "@/features/opponent/components/opponent.table";

const OpponentsPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<OpponentView>();
  const opponentsQuery = useOpponents({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = opponentsQuery.data?.data?.items ?? [];
  const pagination = opponentsQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_opponents"),
      url: "#",
      active: true,
    },
  ];

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("opponents.pages.list.title")}
      desc={t("opponents.pages.list.desc")}
    >
      <>
        <Card className="p-2">
          <CardHeader className="flex items-center justify-between p-0">
            <div>
              <CardTitle>{t("opponents.pages.list.subtitle")}</CardTitle>
              <CardDescription className="text-sm text-card-foreground/70">
                {t("opponents.pages.list.sub_desc")}
              </CardDescription>
            </div>
            <div
              data-slot="filters "
              className="flex items-center  justify-between gap-2"
            >
              <SearchInput
                className="min-w-90"
                placeholder={t("opponents.actions.search")}
                onChange={(val) => table.setQuery(val)}
                value={table.query}
                delay={600}
              />
              {hasPermission({
                permission: PermissionCode.CREATE_OPPONENTS,
              }) && (
                <Button>
                  <RouterLink
                    className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                    to={paths.tenant.opponents.new.route()}
                  >
                    <Plus className="size-4" />
                    <span>{t("opponents.actions.add")}</span>
                  </RouterLink>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <OpponentTable
              opponents={items}
              isLoading={opponentsQuery.isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {pagination && (
            <TablePagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              rootUrl="/opponents"
            />
          )}
        </div>
      </>
    </DashLayout>
  );
};
export default OpponentsPage;

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
import { useCases } from "@/features/case/api/list-case";
import { CaseTable } from "@/features/case/components/ case.table";
import { CaseView } from "@/features/case/types/case.type";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const CasesPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<CaseView>();
  const casesQuery = useCases({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = casesQuery.data?.data?.items ?? [];
  const pagination = casesQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_cases"),
      url: "#",
      active: true,
    },
  ];

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("cases.pages.list.title")}
      desc={t("cases.pages.list.desc")}
    >
      <>
        <Card className="p-2">
          <CardHeader className="flex items-center justify-between p-0">
            <div>
              <CardTitle>{t("cases.pages.list.subtitle")}</CardTitle>
              <CardDescription className="text-sm text-card-foreground/70">
                {t("cases.pages.list.sub_desc")}
              </CardDescription>
            </div>
            <div
              data-slot="filters "
              className="flex items-center  justify-between gap-2"
            >
              <SearchInput
                className="min-w-90"
                placeholder={t("cases.actions.search")}
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
                    to={paths.tenant.cases.new.route()}
                  >
                    <Plus className="size-4" />
                    <span>{t("cases.actions.add")}</span>
                  </RouterLink>
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <CaseTable
              cases={items}
              table={table}
              isLoading={casesQuery.isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {pagination && (
            <TablePagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              rootUrl="/cases"
            />
          )}
        </div>
      </>
    </DashLayout>
  );
};
export default CasesPage;

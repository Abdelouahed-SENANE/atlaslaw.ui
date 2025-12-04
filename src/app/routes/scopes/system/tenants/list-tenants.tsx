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
import { useTenants } from "@/features/tenant/api/list-tenants";
import { TenantTable } from "@/features/tenant/components/tenant-table";
import { Tenant } from "@/features/tenant/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const TenantsPage = () => {
  const { t } = useTranslation();

  const table = useQueryTable<
    Tenant,
    { status: "active" | "suspended" | "" }
  >();
  const tenantsQuery = useTenants({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
      status: table.filters.status,
    },
  });

  const items = tenantsQuery.data?.data?.items ?? [];
  const pagination = tenantsQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_tenants"),
      url: "#",
      active: true,
    },
  ];

  const TENANT_STATUS: { label: string; value: "active" | "suspended" | "" }[] =
    [
      {
        label: t("tenants.status.all"),
        value: "",
      },
      {
        label: t("tenants.status.active"),
        value: "active",
      },
      {
        label: t("tenants.status.suspended"),
        value: "suspended",
      },
    ] as const;
  const isActive = (itemValue: string) => {
    if (!table.filters.status) return itemValue === "";
    return table.filters.status === itemValue;
  };

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("tenants.pages.list.title")}
      desc={t("tenants.pages.list.desc")}
    >
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <div>
            <CardTitle>{t("tenants.pages.list.subtitle")}</CardTitle>
            <CardDescription className="text-sm text-card-foreground/70">
              {t("tenants.pages.list.sub_desc")}
            </CardDescription>
          </div>
          <div
            data-slot="filters "
            className="flex items-center  justify-between gap-2"
          >
            <SearchInput
              className="min-w-90"
              placeholder={t("tenants.actions.search")}
              onChange={(val) => table.setQuery(val)}
              value={table.query}
              delay={600}
            />
            <Button>
              <RouterLink
                className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                to={paths.admin.tenants.new.route()}
              >
                <Plus className="size-4" />
                <span>{t("tenants.actions.add")}</span>
              </RouterLink>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-2">
          {TENANT_STATUS.map((item) => (
            <Button
              className={cn(
                isActive(item.value)
                  ? "border-primary border text-primary"
                  : "border border-input text-card-foreground",
                " hover:border-primary hover:text-primary ltr:mr-1 rtl:ml-1"
              )}
              variant={"plain"}
              onClick={() => table.setFilter("status", item.value)}
              key={item.value}
            >
              {item.label}
            </Button>
          ))}
          <TenantTable
            tenants={items}
            table={table}
            isLoading={tenantsQuery.isLoading}
          />
        </CardContent>
      </Card>

      <div>
        {pagination && (
          <TablePagination
            page={pagination.page}
            total={pagination.total}
            limit={pagination.limit}
            rootUrl="/admin/tenants"
          />
        )}
      </div>
    </DashLayout>
  );
};
export default TenantsPage;

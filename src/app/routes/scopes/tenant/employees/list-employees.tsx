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
import { useEmployees } from "@/features/employee/api/list-employees";
import { EmployeeTable } from "@/features/employee/components/employees-table";
import { Employee } from "@/features/employee/types";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const EmployeesPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<
    Employee,
    { status: "active" | "inactive" | "" }
  >();
  const employeesQuery = useEmployees({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
      status: table.filters.status,
    },
  });

  const items = employeesQuery.data?.data?.items ?? [];
  const pagination = employeesQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_employees"),
      url: "#",
      active: true,
    },
  ];

  const EMPLOYEES_STATUS: {
    label: string;
    value: "active" | "inactive" | "";
  }[] = [
    {
      label: t("employees.status.all"),
      value: "",
    },
    {
      label: t("employees.status.active"),
      value: "active",
    },
    {
      label: t("employees.status.inactive"),
      value: "inactive",
    },
  ] as const;
  const isActive = (itemValue: string) => {
    if (!table.filters.status) return itemValue === "";
    return table.filters.status === itemValue;
  };

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("employees.pages.list.title")}
      desc={t("employees.pages.list.desc")}
    >
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <div>
            <CardTitle>{t("employees.pages.list.subtitle")}</CardTitle>
            <CardDescription className="text-sm text-card-foreground/70">
              {t("employees.pages.list.sub_desc")}
            </CardDescription>
          </div>
          <div
            data-slot="filters "
            className="flex items-center  justify-between gap-2"
          >
            <SearchInput
              className="min-w-90"
              placeholder={t("employees.actions.search")}
              onChange={(val) => table.setQuery(val)}
              value={table.query}
              delay={600}
            />
            {hasPermission({ permission: PermissionCode.CREATE_EMPLOYEES }) && (
              <Button>
                <RouterLink
                  className="text-primary-foreground flex items-center hover:no-underline hover:text-primary-foreground"
                  to={paths.tenant.employees.new.route()}
                >
                  <Plus className="size-4" />
                  <span>{t("employees.actions.add")}</span>
                </RouterLink>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-2">
          {EMPLOYEES_STATUS.map((item) => (
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
          <EmployeeTable
            employees={items}
            table={table}
            isLoading={employeesQuery.isLoading}
          />
        </CardContent>
      </Card>

      <div>
        {pagination && (
          <TablePagination
            page={pagination.page}
            total={pagination.total}
            limit={pagination.limit}
            rootUrl="/admin/employees"
          />
        )}
      </div>
    </DashLayout>
  );
};
export default EmployeesPage;

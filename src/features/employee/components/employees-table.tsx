import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { RoleAssignmentForm } from "@/features/user/components/role-assignement-form";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { Translation } from "@/types/api";
import { Edit, Lock } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Employee } from "../types";
interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<Employee>>;
}
export const EmployeeTable = ({
  employees,
  isLoading,
  table,
}: EmployeeTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();

  const handleAction = useCallback(
    (action: string, id: string, userID: string) => {
      switch (action) {
        case "edit":
          navigate(paths.tenant.employees.edit.route(id));
          break;
        case "assign_roles":
          setId(userID);
          open();
          break;
        default:
          break;
      }
    },
    []
  );

  const ACTIONS: QuickAction[] = [
    {
      label: t("employees.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_EMPLOYEES,
    },
    {
      label: t("employees.actions.assign_roles"),
      value: "assign_roles",
      icon: <Lock className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_EMPLOYEES,
    },
  ];
  const FILTER_ACTIONS = ACTIONS.filter(({ permission }) =>
    hasPermission({ permission })
  );

  const columns = useMemo<TableColumn<Employee>[]>(
    () => [
      {
        title: t("employees.columns.user_name"),
        field: "user",
        Cell: ({ entry: { user } }) => (
          <div>{user?.name[lang] || user?.email}</div>
        ),
      },
      {
        title: t("employees.columns.job_title"),
        field: "job_title",
      },
      {
        title: t("employees.columns.work_phone"),
        field: "work_phone",
      },
      {
        title: t("employees.columns.hiring_date"),
        field: "hiring_date",
      },
      {
        title: t("employees.columns.status"),
        field: "status",
        Cell: ({ entry: { status } }) => (
          <Badge
            className={cn(
              "capitalize rounded-xs",
              status === "active"
                ? "bg-success/10 font-bold text-success"
                : "bg-error/10 font-bold text-error"
            )}
          >
            {status}
          </Badge>
        ),
      },
      {
        title: t("employees.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("employees.columns.updated_at"),
        field: "updated_at",
      },
      {
        title: "",
        field: "id",

        Cell: ({ entry: { id, user } }) => (
          <QuickActions
            id={id}
            actions={FILTER_ACTIONS}
            onAction={(action, id) => handleAction(action, id, user?.id!)}
          />
        ),
      },
    ],
    []
  );
  return (
    <>
      <Table<Employee>
        data={employees}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(employees.map((r) => r.id!))}
        emptyMessage={t("employees.pages.list.empty_msg")}
      />

      <RoleAssignmentForm
        open={isOpen}
        userID={id}
        onOpenChange={(isOpen) => {
          isOpen ? open() : close();
        }}
        title={t("employees.drawer.assign_roles.title")}
      />
    </>
  );
};

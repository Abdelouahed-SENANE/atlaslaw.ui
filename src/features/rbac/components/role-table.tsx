import { QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Role } from "@/types/api";
import { Edit, Key, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConfirmRoleDelation } from "./confirm-role-delete";
interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<Role>>;
}
export const RoleTable = ({ roles, isLoading, table }: RoleTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();
  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "manage_permissions":
        navigate(paths.admin.rbac.roles.permissions.route(id));
        break;
      case "edit":
        console.log(id);
        break;
      case "delete":
        setId(id);
        open();
        break;
      default:
        break;
    }
  }, []);
  const columns = useMemo<TableColumn<Role>[]>(
    () => [
      {
        title: t("roles.columns.name"),
        field: "name",
      },
      {
        title: t("roles.columns.description"),
        field: "description",
      },
      {
        title: t("roles.columns.scope"),
        field: "scope",
      },
      {
        title: t("roles.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("roles.columns.updated_at"),
        field: "updated_at",
      },
      {
        title: "",
        field: "id",
        Cell: ({ entry: { id } }) => (
          <QuickActions
            id={id}
            actions={[
              {
                label: t("roles.actions.manage_permissions"),
                value: "manage_permissions",
                icon: <Key className="h-4 w-4 text-foreground" />,
              },
              {
                label: t("roles.actions.edit"),
                value: "edit",
                icon: <Edit className="h-4 w-4 text-foreground" />,
              },
              {
                label: t("roles.actions.delete"),
                value: "delete",
                icon: <Trash className="h-4 w-4 text-foreground" />,
              },
            ]}
            onAction={handleAction}
          />
        ),
      },
    ],
    []
  );
  return (
    <>
      <Table<Role>
        data={roles}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(roles.map((r) => r.id!))}
        emptyMessage={t("roles.page.list_empty")}
      />
      <ConfirmRoleDelation
        roleID={id}
        open={isOpen}
        onOpenChange={(open) => (open ? open : close())}
        onDeleted={() => setId("")}
      />
    </>
  );
};

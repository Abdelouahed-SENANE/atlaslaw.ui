import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Role } from "../types";
import { ConfirmRoleDelation } from "./confirm-role-delete";

// -------------------------------
// TYPES
// -------------------------------

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<Role>>;
  actions: QuickAction[];
  onAction?: (action: string, id: string) => void;
}

// -------------------------------
// COMPONENT
// -------------------------------
export const RoleTable = ({
  roles,
  isLoading,
  table,
  actions,
  onAction,
}: RoleTableProps) => {
  const { t } = useTranslation();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();

  // -------------------------------
  // ACTION HANDLER
  // -------------------------------
  const handleAction = useCallback(
    (action: string, id: string) => {
      if (action === "delete") {
        setId(id);
        open();
        return;
      }

      onAction?.(action, id);
    },
    [onAction, open]
  );

  // -------------------------------
  // COLUMNS
  // -------------------------------
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
        Cell: ({ entry }) => (
          <QuickActions
            id={entry.id}
            actions={actions}
            onAction={handleAction}
          />
        ),
      },
    ],
    [actions, handleAction, t]
  );

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <>
      <Table<Role>
        data={roles}
        columns={columns}
        isLoading={isLoading}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(roles.map((r) => r.id!))}
        emptyMessage={t("roles.page.list_empty")}
      />

      <ConfirmRoleDelation
        roleID={id}
        open={isOpen}
        onOpenChange={(o) => (o ? open() : close())}
        onDeleted={() => setId("")}
      />
    </>
  );
};

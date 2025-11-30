import { Table, TableColumn } from "@/components/ui/table";
import { useTable } from "@/components/ui/table/use-table";
import { Role } from "@/types/api";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  table: ReturnType<typeof useTable<Role>>;
}
export const RoleTable = ({ roles, isLoading , table}: RoleTableProps) => {
  const { t } = useTranslation();

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
    ],
    []
  );
  return (
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
  );
};

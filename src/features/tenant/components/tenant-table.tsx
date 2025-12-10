import { Badge } from "@/components/ui/badge";
import { QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { paths } from "@/config/paths";
import { PermissionCode } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Tenant } from "../types";
interface TenantTableProps {
  tenants: Tenant[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<Tenant>>;
}
export const TenantTable = ({
  tenants,
  isLoading,
  table,
}: TenantTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  //   const [id, setId] = useState<string>("");
  //   const { open, close, isOpen } = useDisclosure();

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "edit":
        navigate(paths.admin.tenants.edit.route(id));
        break;
      default:
        break;
    }
  }, []);
  const columns = useMemo<TableColumn<Tenant>[]>(
    () => [
      {
        title: t("tenants.columns.name"),
        field: "name",
      },
      {
        title: t("tenants.columns.slug"),
        field: "slug",
      },
      {
        title: t("tenants.columns.status"),
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
        title: t("tenants.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("tenants.columns.updated_at"),
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
                label: t("tenants.actions.edit"),
                value: "edit",
                icon: <Edit className="h-4 w-4 text-foreground" />,
                permission: PermissionCode.UPDATE_TENANTS,
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
      <Table<Tenant>
        data={tenants}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(tenants.map((r) => r.id!))}
        emptyMessage={t("tenants.pages.list.empty_msg")}
      />
    </>
  );
};

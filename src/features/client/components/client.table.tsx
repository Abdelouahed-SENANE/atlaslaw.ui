import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Translation } from "@/types/api";
import { Edit, Lock, Mail, Phone, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ClientView } from "../types/client.type";
import { ClientDeleteDialog } from "./client.delete-dialog";
interface ClientTableProps {
  clients: ClientView[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<ClientView>>;
}
export const ClientTable = ({
  clients,
  isLoading,
  table,
}: ClientTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "edit":
        navigate(paths.tenant.clients.edit.route(id));
        break;
      case "delete":
        setId(id);
        open();
        break;
      default:
        break;
    }
  }, []);

  const ACTIONS: QuickAction[] = [
    {
      label: t("clients.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_CLIENTS,
    },
    {
      label: t("clients.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.DELETE_CLIENTS,
    },
  ];
  const FILTER_ACTIONS = ACTIONS.filter(({ permission }) =>
    hasPermission({ permission })
  );

  const columns = useMemo<TableColumn<ClientView>[]>(
    () => [
      {
        title: t("clients.columns.name"),
        field: "name",
        Cell: ({ entry: { name } }) => <div>{name[lang]}</div>,
      },
      {
        title: t("clients.columns.national_id"),
        field: "national_id",
        Cell: ({ entry: { national_id } }) => <div>{national_id || "-"}</div>,
      },
      {
        title: t("clients.columns.client_type"),
        field: "client_type",
        Cell: ({ entry: { client_type } }) => (
          <Badge className="bg-primary/20 text-primary">
            {client_type[lang]}
          </Badge>
        ),
      },
      {
        title: t("clients.columns.contact"),
        field: "contact",
        Cell: ({ entry: { contact } }) => (
          <div className="flex flex-col">
            {contact?.email && (
              <span className="flex items-center gap-2">
                <Mail className="size-4.5" />
                {contact?.email}
              </span>
            )}
            {contact?.mobile && (
              <span className="flex items-center gap-2">
                <Phone className="size-4.5" />
                {contact?.mobile}
              </span>
            )}
          </div>
        ),
      },
      {
        title: t("clients.columns.notes"),
        field: "notes",
        Cell({ entry: { notes } }) {
          return (
            <p
              className="max-w-70 truncate whitespace-nowrap overflow-hidden"
              title={notes} // optional: show full text on hover
            >
              {notes}
            </p>
          );
        },
      },
      {
        title: t("clients.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("clients.columns.updated_at"),
        field: "updated_at",
      },
      {
        title: "",
        field: "id",

        Cell: ({ entry: { id } }) => (
          <QuickActions
            id={id}
            actions={FILTER_ACTIONS}
            onAction={(action, id) => handleAction(action, id)}
          />
        ),
      },
    ],
    [lang]
  );
  return (
    <>
      <Table<ClientView>
        data={clients}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(clients.map((r) => r.id!))}
        emptyMessage={t("clients.pages.list.empty_msg")}
      />
      <ClientDeleteDialog
        id={id}
        open={isOpen}
        onOpenChange={close}
        onDeleted={() => setId("")}
      />
    </>
  );
};

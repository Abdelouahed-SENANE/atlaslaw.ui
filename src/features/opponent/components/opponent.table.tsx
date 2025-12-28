import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Translation } from "@/types/api";
import { Edit, Mail, Phone, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { OpponentView } from "../types/opponent.type";
import { OpponentDeleteDialog } from "./opponent.delete-dialog";

interface OpponentTableProps {
  opponents: OpponentView[];
  isLoading: boolean;
}
export const OpponentTable = ({ opponents, isLoading }: OpponentTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "edit":
        navigate(paths.tenant.opponents.edit.route(id));
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
      label: t("opponents.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_OPPONENTS,
    },
    {
      label: t("opponents.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.DELETE_OPPONENTS,
    },
  ];
  const FILTER_ACTIONS = ACTIONS.filter(({ permission }) =>
    hasPermission({ permission })
  );

  const columns = useMemo<TableColumn<OpponentView>[]>(
    () => [
      {
        title: t("opponents.columns.name"),
        field: "name",
        Cell: ({ entry: { name } }) => <div>{name[lang]}</div>,
      },
      {
        title: t("opponents.columns.national_id"),
        field: "national_id",
        Cell: ({ entry: { national_id } }) => <div>{national_id || "-"}</div>,
      },
      {
        title: t("opponents.columns.opponent_type"),
        field: "opponent_type",
        Cell: ({ entry: { opponent_type } }) => (
          <Badge className="bg-primary/20 text-primary">
            {opponent_type[lang]}
          </Badge>
        ),
      },
      {
        title: t("opponents.columns.contact"),
        field: "contact",
        Cell: ({ entry: { contact } }) =>
          contact ? (
            <div className="flex flex-col">
              {contact.email && (
                <span className="flex items-center gap-2">
                  <Mail className="size-4.5" />
                  {contact.email}
                </span>
              )}
              {contact.mobile && (
                <span className="flex items-center gap-2">
                  <Phone className="size-4.5" />
                  {contact.mobile}
                </span>
              )}
            </div>
          ) : <span>-</span>,
      },
      {
        title: t("opponents.columns.notes"),
        field: "notes",
        Cell({ entry: { notes } }) {
          return (
            <p
              className="max-w-70 truncate whitespace-nowrap overflow-hidden"
              title={notes} 
            > 
              {notes ?? "-"}
            </p>
          );
        },
      },
      {
        title: t("opponents.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("opponents.columns.updated_at"),
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
      <Table<OpponentView>
        data={opponents}
        columns={columns}
        isLoading={isLoading}
        emptyMessage={t("opponents.pages.list.empty_msg")}
      />
      <OpponentDeleteDialog
        id={id}
        open={isOpen}
        onOpenChange={close}
        onDeleted={() => setId("")}
      />
    </>
  );
};

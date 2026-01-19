import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Translation } from "@/types/api";
import { Edit, Eye, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CaseView } from "../types/case.type";
import { CaseDeleteDialog } from "./case-delete-dialog";

interface CaseTableProps {
  cases: CaseView[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<CaseView>>;
}
export const CaseTable = ({ cases, isLoading, table }: CaseTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const navigate = useNavigate();
  const { hasPermission } = useAuthorization();
  const [id, setId] = useState<string>("");
  const { open, close, isOpen } = useDisclosure();

  const handleAction = useCallback((action: string, id: string) => {
    switch (action) {
      case "view":
        navigate(paths.tenant.cases.view.route(id));
        break;
      case "edit":
        navigate(paths.tenant.cases.edit.route(id));
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
      label: t("cases.actions.view"),
      value: "view",
      icon: <Eye className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.VIEW_CLIENTS,
    },
    {
      label: t("cases.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_CLIENTS,
    },
    {
      label: t("cases.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.DELETE_CLIENTS,
    },
  ];
  const FILTER_ACTIONS = ACTIONS.filter(({ permission }) =>
    hasPermission({ permission })
  );

  const columns = useMemo<TableColumn<CaseView>[]>(
    () => [
      {
        title: t("cases.columns.case_ref"),
        field: "case_ref",
      },
      {
        title: t("cases.columns.client_name"),
        field: "client_name",
        Cell: ({ entry: { client_name } }) => (
          <div>{client_name[lang] || "-"}</div>
        ),
      },
      {
        title: t("cases.columns.opponent_name"),
        field: "opponent_name",
        Cell({ entry: { opponent_name } }) {
          return (
            <p
              className="max-w-70 truncate whitespace-nowrap overflow-hidden"
              title={opponent_name[lang]}
            >
              {opponent_name[lang]}
            </p>
          );
        },
      },
      {
        title: t("cases.columns.code_case"),
        field: "category",
        Cell: ({ entry: { category } }) => (
          <Badge className="bg-primary/20 text-primary">{category[lang]}</Badge>
        ),
      },
      {
        title: t("cases.columns.case_manager"),
        field: "case_manager",
        Cell({ entry: { case_manager } }) {
          return <p>{case_manager[lang]}</p>;
        },
      },
      {
        title: t("cases.columns.created_by"),
        field: "created_by",
        Cell({ entry: { created_by } }) {
          return <p>{created_by[lang]}</p>;
        },
      },
      {
        title: t("cases.columns.opening_date"),
        field: "opening_date",
        Cell({ entry: { opening_date } }) {
          return <p>{opening_date.toString()}</p>;
        },
      },
      {
        title: t("cases.columns.note"),
        field: "note",
        Cell({ entry: { note } }) {
          return (
            <p
              className="max-w-70 truncate whitespace-nowrap overflow-hidden"
              title={note}
            >
              {note}
            </p>
          );
        },
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
      <Table<CaseView>
        data={cases}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(cases.map((r) => r.id!))}
        emptyMessage={t("cases.pages.list.empty_msg")}
      />
      <CaseDeleteDialog
        id={id}
        open={isOpen}
        onOpenChange={close}
        onDeleted={() => setId("")}
      />
    </>
  );
};

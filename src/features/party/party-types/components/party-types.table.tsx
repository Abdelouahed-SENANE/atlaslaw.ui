import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import i18n from "@/config/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { Translation } from "@/types/api";
import { Edit, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdatePartyType } from "../api/party-type.update";
import { PartyType } from "../types/party-type";
import { PartyTypeDeleteDialog } from "./party-type.delete-dialog";
import { PartyTypeForm } from "./party-types.form";
interface PartyTypeTableProps {
  partyTypes: PartyType[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<PartyType>>;
}
export const PartyTypeTable = ({
  partyTypes,
  isLoading,
  table,
}: PartyTypeTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const { hasPermission } = useAuthorization();
  const [selected, setSelected] = useState<PartyType | undefined>(undefined);
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const handleAction = useCallback(
    (action: string, row: PartyType) => {
      switch (action) {
        case "edit":
          setSelected(row);
          editModal.open();
          break;
        case "delete":
          setSelected(row);
          deleteModal.open();
          break;
        default:
          break;
      }
    },
    [selected, setSelected]
  );

  const ACTIONS: QuickAction[] = [
    {
      label: t("party_types.actions.edit"),
      value: "edit",
      icon: <Edit className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.UPDATE_PARTY_TYPES,
    },
    {
      label: t("party_types.actions.delete"),
      value: "delete",
      icon: <Trash className="h-4 w-4 text-foreground" />,
      permission: PermissionCode.DELETE_PARTY_TYPES,
    },
  ];
  const FILTER_ACTIONS = ACTIONS.filter(({ permission }) =>
    hasPermission({ permission })
  );

  const columns = useMemo<TableColumn<PartyType>[]>(
    () => [
      {
        title: t("party_types.columns.name"),
        field: "name",
        sortable: true,
        Cell: ({ entry: { name } }) => {
          return <span>{name[lang]}</span>;
        },
      },
      {
        title: t("party_types.columns.description"),
        field: "description",
        Cell: ({ entry: { description } }) => {
          return <span>{description[lang]}</span>;
        },
      },
      {
        title: t("party_types.columns.is_active"),
        field: "is_active",
        Cell: ({ entry: { is_active } }) => {
          return (
            <Badge
              className={cn(
                is_active
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error",
                "capitalize rounded-xs"
              )}
            >
              {is_active ? t("global.yes") : t("global.no")}
            </Badge>
          );
        },
      },

      {
        title: t("party_types.columns.created_at"),
        field: "created_at",
      },
      {
        title: t("party_types.columns.updated_at"),
        field: "updated_at",
      },
      {
        title: "",
        field: "id",

        Cell: ({ entry }) => (
          <QuickActions
            id={entry.id!}
            actions={FILTER_ACTIONS}
            onAction={(action) => handleAction(action, entry)}
          />
        ),
      },
    ],
    [t, lang, handleAction, FILTER_ACTIONS]
  );

  const updatePartyTypeMutation = useUpdatePartyType({
    id: selected?.id!,
    mutationConfig: {
      onSuccess: () => {},
      onError: () => {},
    },
  });
  return (
    <>
      <Table<PartyType>
        data={partyTypes}
        columns={columns}
        isLoading={isLoading}
        /* ---- Selection ---- */
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(partyTypes.map((r) => r.id!))}
        emptyMessage={t("party_types.pages.list.empty_msg")}
      />

      <PartyTypeForm
        mode="update"
        open={editModal.isOpen}
        onOpenChange={editModal.toggle}
        onClose={editModal.close}
        defaultValues={selected}
        onSubmit={(values) =>
          updatePartyTypeMutation.mutate({
            id: selected?.id!,
            payload: values,
          })
        }
        isDone={updatePartyTypeMutation.isSuccess}
        apiErrors={{}}
        isLoading={updatePartyTypeMutation.isPending}
      />

      <PartyTypeDeleteDialog
        id={selected?.id!}
        open={deleteModal.isOpen}
        onOpenChange={(o) => (o ? deleteModal.open() : deleteModal.close())}
        onDeleted={() => setSelected(undefined)}
      />
    </>
  );
};

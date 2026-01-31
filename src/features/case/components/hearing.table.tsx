import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { toast } from "@/components/ui/toast/use-toast";
import i18n from "@/config/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { formatDateOnly, formatDateTime } from "@/lib/utils";
import { Translation } from "@/types/api";
import { Edit, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUpdateHearing } from "../api/update-hearing";
import { HearingView } from "../types/case.type";
import { HearingDeleteDialog } from "./hearing.delete-dialog";
import { HearingForm, HearingFormInputs } from "./hearing.form";

interface HearingTableProps {
  hearings: HearingView[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<HearingView>>;
}
export const HearingTable = ({
  hearings,
  isLoading,
  table,
}: HearingTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const { hasPermission } = useAuthorization();
  const [selected, setSelected] = useState<HearingView | undefined>(undefined);

  const { open: openDel, close: closeDel, isOpen: isOpenDel } = useDisclosure();
  const {
    open: updateOpen,
    close: updateClose,
    isOpen: isOpenUpdate,
  } = useDisclosure();

  const handleAction = useCallback(
    (action: string, hearing: HearingView) => {
      switch (action) {
        case "edit":
          setSelected(hearing);
          updateOpen();
          break;
        case "delete":
          setSelected(hearing);
          openDel();
          break;
        default:
          break;
      }
    },
    [updateOpen, openDel],
  );

  const ACTIONS = useMemo<QuickAction[]>(
    () => [
      {
        label: t("hearings.actions.edit"),
        value: "edit",
        icon: <Edit className="h-4 w-4 text-foreground" />,
        permission: PermissionCode.UPDATE_HEARINGS,
      },
      {
        label: t("hearings.actions.delete"),
        value: "delete",
        icon: <Trash className="h-4 w-4 text-foreground" />,
        permission: PermissionCode.DELETE_HEARINGS,
      },
    ],
    [t],
  );

  const FILTER_ACTIONS = useMemo(
    () => ACTIONS.filter(({ permission }) => hasPermission({ permission })),
    [ACTIONS, hasPermission],
  );
  const updateHearing = useUpdateHearing({
    id: selected?.id as string,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("hearings.toast.updated_title"),
          description: t("hearings.toast.updated_desc"),
          type: "success",
        });
      },
      onError: (error: any) => {
        if (error.response.status !== 422) {
          toast({
            title: t("hearings.toast.error_update_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });

  const handleSubmit = (values: HearingFormInputs) => {
    updateHearing.mutate({
      id: selected?.id as string,
      payload: values,
    });
  };

  const columns = useMemo<TableColumn<HearingView>[]>(
    () => [
      {
        title: t("hearings.columns.procedure_number"),
        field: "procedure_number",
        Cell: ({
          entry: {
            procedure_code: code,
            procedure_number: number,
            procedure_year: year,
          },
        }) => (
          <div>
            {number}/{code}/{year}
          </div>
        ),
      },
      {
        title: t("hearings.columns.hearing_date"),
        field: "hearing_date",
        Cell: ({ entry: { hearing_date } }) => (
          <div>{formatDateOnly(hearing_date, lang)} </div>
        ),
      },
      {
        title: t("hearings.columns.next_hearing_at"),
        field: "next_hearing_at",
        Cell: ({ entry: { next_hearing_at } }) => (
          <div>{formatDateTime(next_hearing_at, lang)}</div>
        ),
      },
      {
        title: t("hearings.columns.client_name"),
        field: "client_name",
        Cell: ({ entry: { client_name } }) => <p>{client_name[lang]}</p>,
      },
      {
        title: t("hearings.columns.case_ref"),
        field: "case_ref",
        Cell: ({ entry: { case_ref } }) => <p>{case_ref}</p>,
      },
      {
        title: t("hearings.columns.category_name"),
        field: "category_name",
        Cell: ({ entry: { category_name } }) => (
          <Badge className="bg-primary/20 text-primary">
            {category_name[lang]}
          </Badge>
        ),
      },
      {
        title: t("hearings.columns.judge_name"),
        field: "judge_name",
        Cell: ({ entry: { judge_name } }) => <div>{judge_name}</div>,
      },
      {
        title: t("hearings.columns.room_number"),
        field: "room_number",
        Cell: ({ entry: { room_number } }) => <div>{room_number}</div>,
      },
      {
        title: t("hearings.columns.court"),
        field: "court_name",
        Cell: ({ entry: { court_name } }) => <p>{court_name[lang]}</p>,
      },
      {
        title: "",
        field: "id",
        Cell: ({ entry }) => (
          <QuickActions
            id={entry.id!}
            actions={FILTER_ACTIONS}
            onAction={(act) => handleAction(act, entry)}
          />
        ),
      },
    ],
    [t, lang, FILTER_ACTIONS, handleAction],
  );

  return (
    <>
      <Table<HearingView>
        data={hearings}
        columns={columns}
        isLoading={isLoading}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(hearings.map((r) => r.id!))}
        emptyMessage={t("hearings.pages.list.empty_msg")}
      />
      <HearingDeleteDialog
        id={selected?.id as string}
        open={isOpenDel}
        onOpenChange={(open) => (open ? openDel() : closeDel())}
        onDeleted={() => setSelected(undefined)}
      />
      {!selected ? null : (
        <HearingForm
          mode="update"
          caseId={selected?.case_id as string}
          defaultValues={selected ?? undefined}
          open={isOpenUpdate}
          onOpenChange={(open) => (open ? updateOpen() : updateClose())}
          isDone={updateHearing.isSuccess}
          isLoading={updateHearing.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

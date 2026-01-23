import { Badge } from "@/components/ui/badge";
import { QuickAction, QuickActions } from "@/components/ui/quick-actions";
import { Table, TableColumn } from "@/components/ui/table";
import { useQueryTable } from "@/components/ui/table/use-query-table";
import { toast } from "@/components/ui/toast/use-toast";
import i18n from "@/config/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Translation } from "@/types/api";
import { Edit, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useProcedureForm } from "../api/procedure.edit.query";
import { useUpdateProcedure } from "../api/update-procedure";
import { ProcedureFormView, ProcedureView } from "../types/case.type";
import { ProcedureDeleteDialog } from "./procedure.delete-dialog";
import { ProcedureForm, ProcedureFormInputs } from "./procedure.form";

interface ProcedureTableProps {
  procedures: ProcedureView[];
  isLoading: boolean;
  table: ReturnType<typeof useQueryTable<ProcedureView>>;
  prefix: string;
}
export const ProcedureTable = ({
  procedures,
  isLoading,
  table,
  prefix,
}: ProcedureTableProps) => {
  const { t } = useTranslation();
  const lang: keyof Translation = i18n.language as keyof Translation;
  const { hasPermission } = useAuthorization();
  const [id, setId] = useState<string>("");
  const { open: openDel, close: closeDel, isOpen: isOpenDel } = useDisclosure();
  const {
    open: updateOpen,
    close: updateClose,
    isOpen: isOpenUpdate,
  } = useDisclosure();

  const handleAction = useCallback(
    (action: string, id: string) => {
      switch (action) {
        case "edit":
          setId(id);
          updateOpen();
          break;
        case "delete":
          setId(id);
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
        label: t("procedures.actions.edit"),
        value: "edit",
        icon: <Edit className="h-4 w-4 text-foreground" />,
        permission: PermissionCode.UPDATE_PROCEDURES,
      },
      {
        label: t("procedures.actions.delete"),
        value: "delete",
        icon: <Trash className="h-4 w-4 text-foreground" />,
        permission: PermissionCode.DELETE_PROCEDURES,
      },
    ],
    [t],
  );

  const FILTER_ACTIONS = useMemo(
    () => ACTIONS.filter(({ permission }) => hasPermission({ permission })),
    [ACTIONS, hasPermission],
  );
  const updateProcedure = useUpdateProcedure({
    id,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("toast.updated_title"),
          description: t("procedures.toast.updated_desc"),
          type: "success",
        });
      },
      onError: (error: any) => {
        if (error.response.status !== 422) {
          toast({
            title: t("procedures.toast.error_update_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });

  const handleSubmit = (values: ProcedureFormInputs) => {
    
    updateProcedure.mutate({
      id,
      payload: values,
    });
  };

  const columns = useMemo<TableColumn<ProcedureView>[]>(
    () => [
      {
        title: t("procedures.columns.procedure_number"),
        field: "id",
        Cell: ({ entry: { code, number, year } }) => (
          <div>
            {number}/{code}/{year}
          </div>
        ),
      },
      {
        title: t("procedures.columns.procedure_date"),
        field: "procedure_date",
        Cell: ({ entry: { procedure_date } }) => (
          <div>{new Date(procedure_date).toString()}</div>
        ),
      },
      {
        title: t("procedures.columns.criteria"),
        field: "criteria",
        Cell: ({ entry: { criteria } }) => (
          <Badge className="bg-primary/20 text-primary">{criteria}</Badge>
        ),
      },
      {
        title: t("procedures.columns.court"),
        field: "court_name",
        Cell: ({ entry: { court_name } }) => <p>{court_name[lang]}</p>,
      },
      {
        title: "",
        field: "id",
        Cell: ({ entry: { id } }) => (
          <QuickActions
            id={id}
            actions={FILTER_ACTIONS}
            onAction={handleAction}
          />
        ),
      },
    ],
    [t, lang, FILTER_ACTIONS, handleAction],
  );

  const procedureFormQuery = useProcedureForm({
    id,
    queryConfig: {
      enabled: isOpenUpdate && !!id,
    },
  });

  const procedure = procedureFormQuery.data?.data;

  return (
    <>
      <Table<ProcedureView>
        data={procedures}
        columns={columns}
        isLoading={isLoading}
        selectedRows={table.selectedRows}
        onSelectRow={(id) => table.toggleRow(id)}
        onSelectAll={() => table.toggleAll(procedures.map((r) => r.id!))}
        emptyMessage={t("procedures.pages.list.empty_msg")}
      />
      <ProcedureDeleteDialog
        id={id}
        open={isOpenDel}
        onOpenChange={(open) => (open ? openDel() : closeDel())}
        onDeleted={() => setId("")}
      />
      {procedureFormQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProcedureForm
          mode="update"
          defaultValues={procedure as ProcedureFormView}
          open={isOpenUpdate}
          onOpenChange={(open) => (open ? updateOpen() : updateClose())}
          isDone={updateProcedure.isSuccess}
          isLoading={updateProcedure.isPending}
          onSubmit={handleSubmit}
          prefix={prefix}
          title={t("procedures.form.update")}
        />
      )}
    </>
  );
};

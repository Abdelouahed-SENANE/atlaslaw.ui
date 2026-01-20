import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteProcedure } from "../api/delete-procedure";

type ProcedureDeleteDialogProps = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProcedureDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: ProcedureDeleteDialogProps) => {
  const { t } = useTranslation();
  const deleteProcedure = useDeleteProcedure({
    id,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("procedures.toast.deleted_title"),
          description: t("procedures.toast.deleted_desc"),
          type: "success",
        });
        onOpenChange(false);
        onDeleted?.();
      },
    },
  });
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => setInternalOpen(open), [open]);

  const handleConfirm = () => {
    if (!id) return;
    deleteProcedure.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("procedures.modal.delete_title")}
      body={t("procedures.modal.delete_desc")}
      icon="danger"
      isDone={deleteProcedure.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteProcedure.isPending}
          isLoading={deleteProcedure.isPending}
        >
          {deleteProcedure.isPending
            ? t("procedures.modal.deleting")
            : t("procedures.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteProcedure.isPending}
        >
          {t("procedures.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};

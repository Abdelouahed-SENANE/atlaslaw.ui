import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/use-toast";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { useTranslation } from "react-i18next";
import { useDeleteOpponent } from "../api/delete-opponent";

type OpponentDeleteDialogProps = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const OpponentDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: OpponentDeleteDialogProps) => {
    const { t } = useTranslation();
  const deleteOpponent = useDeleteOpponent({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("opponents.toast.deleted_title"),
          description: t("opponents.toast.deleted_desc"),
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
    deleteOpponent.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("opponents.modal.delete_title")}
      body={t("opponents.modal.delete_desc")}
      icon="danger"
      isDone={deleteOpponent.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteOpponent.isPending}
          isLoading={deleteOpponent.isPending}
        >
          {deleteOpponent.isPending ? t("opponents.modal.deleting") : t("opponents.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close : () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteOpponent.isPending}
        >
          {t("opponents.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};
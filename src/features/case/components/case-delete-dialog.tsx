import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteCase } from "../api/delete-case";

type CaseDeleteDialogProps = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CaseDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: CaseDeleteDialogProps) => {
  const { t } = useTranslation();
  const deleteCase = useDeleteCase({
    id: id!,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("cases.toast.deleted_title"),
          description: t("cases.toast.deleted_desc"),
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
    deleteCase.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("cases.modal.delete_title")}
      body={t("cases.modal.delete_desc")}
      icon="danger"
      isDone={deleteCase.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteCase.isPending}
          isLoading={deleteCase.isPending}
        >
          {deleteCase.isPending
            ? t("cases.modal.deleting")
            : t("cases.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteCase.isPending}
        >
          {t("cases.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};

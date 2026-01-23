import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteHearing } from "../api/delete-hearing";

type HearingDeleteDialogProps = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const HearingDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: HearingDeleteDialogProps) => {
  const { t } = useTranslation();
  
  const deleteHearing = useDeleteHearing({
    id,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("hearings.toast.deleted_title"),
          description: t("hearings.toast.deleted_desc"),
          type: "success",
        });
        onOpenChange(false);
        onDeleted?.();
      },
      onError: (err: any) => {
        if (err.response.status === 409) {
          toast({
            title: t("hearings.toast.conflict_title"),
            description: err.response.data.message,
            type: "error",
          });
        }
      },
    },
  });
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => setInternalOpen(open), [open]);

  const handleConfirm = () => {
    if (!id) return;
    deleteHearing.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("hearings.modal.delete_title")}
      body={t("hearings.modal.delete_desc")}
      icon="danger"
      isDone={deleteHearing.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteHearing.isPending}
          isLoading={deleteHearing.isPending}
        >
          {deleteHearing.isPending
            ? t("hearings.modal.deleting")
            : t("hearings.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteHearing.isPending}
        >
          {t("hearings.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};

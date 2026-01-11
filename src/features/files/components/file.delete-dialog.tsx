import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeleteFile } from "../api/delete-file";

type ConfirmFileDelationProps = {
  id?: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ConfirmFileDelation = ({
  open,
  id,
  onOpenChange,
  onDeleted,
}: ConfirmFileDelationProps) => {
  const { t } = useTranslation();
  const deleteFile = useDeleteFile({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("files.toast.deleted_title"),
          description: t("files.toast.deleted_desc"),
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
    deleteFile.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("files.modal.delete_title")}
      body={t("files.modal.delete_desc")}
      icon="danger"
      isDone={deleteFile.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteFile.isPending}
          isLoading={deleteFile.isPending}
        >
          {deleteFile.isPending
            ? t("files.modal.deleting")
            : t("files.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteFile.isPending}
        >
          {t("files.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};

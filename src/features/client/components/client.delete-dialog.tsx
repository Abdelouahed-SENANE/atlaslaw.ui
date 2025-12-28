import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/use-toast";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { useTranslation } from "react-i18next";
import { useDeleteClient } from "../api/delete-client";

type ClientDeleteDialogProps = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ClientDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: ClientDeleteDialogProps) => {
    const { t } = useTranslation();
  const deleteClient = useDeleteClient({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("client.toast.deleted_title"),
          description: t("client.toast.deleted_desc"),
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
    deleteClient.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("clients.modal.delete_title")}
      body={t("clients.modal.delete_desc")}
      icon="danger"
      isDone={deleteClient.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteClient.isPending}
          isLoading={deleteClient.isPending}
        >
          {deleteClient.isPending ? t("clients.modal.deleting") : t("clients.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close : () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteClient.isPending}
        >
          {t("clients.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};
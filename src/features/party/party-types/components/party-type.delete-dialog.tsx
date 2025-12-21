import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { toast } from "@/components/ui/toast/use-toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDeletePartyType } from "../api/party-type.delete";

type Props = {
  id: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const PartyTypeDeleteDialog = ({
  id,
  open,
  onOpenChange,
  onDeleted,
}: Props) => {
  const { t } = useTranslation();
  const deleteMutation = useDeletePartyType({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("client_types.toast.deleted_title"),
          description: t("client_types.toast.deleted_desc"),
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
    deleteMutation.mutate({ id: id });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("client_types.modal.delete_title")}
      body={t("client_types.modal.delete_desc")}
      icon="danger"
      isDone={deleteMutation.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteMutation.isPending}
          isLoading={deleteMutation.isPending}
        >
          {deleteMutation.isPending
            ? t("client_types.modal.deleting")
            : t("client_types.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close: () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteMutation.isPending}
        >
          {t("client_types.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};

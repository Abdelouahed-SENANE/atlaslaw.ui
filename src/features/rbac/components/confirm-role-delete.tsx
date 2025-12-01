import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/use-toast";
import { ConfirmationDialog } from "@/components/ui/dialog/index";
import { useDeleteRole } from "../api/delete-role";
import { useTranslation } from "react-i18next";

type ConfirmRoleDelationProps = {
  roleID: string;
  onDeleted?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ConfirmRoleDelation = ({
  roleID,
  open,
  onOpenChange,
  onDeleted,
}: ConfirmRoleDelationProps) => {
    const { t } = useTranslation();
  const deleteTag = useDeleteRole({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("roles.toast.deleted_title"),
          description: t("roles.toast.deleted_desc"),
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
    if (!roleID) return;
    deleteTag.mutate({ id: roleID });
    onDeleted?.();
  };

  return (
    <ConfirmationDialog
      open={internalOpen}
      onOpenChange={onOpenChange}
      title={t("roles.modal.delete_title")}
      body={t("roles.modal.delete_desc")}
      icon="danger"
      isDone={deleteTag.isSuccess}
      confirmButton={
        <Button
          className="bg-error/80 hover:bg-error/60 flex items-center gap-2"
          onClick={handleConfirm}
          disabled={deleteTag.isPending}
          isLoading={deleteTag.isPending}
        >
          {deleteTag.isPending ? t("roles.modal.deleting") : t("roles.modal.delete_submit")}
        </Button>
      }
      cancelButton={(close : () => void) => (
        <Button
          variant="outline"
          onClick={close}
          disabled={deleteTag.isPending}
        >
          {t("roles.modal.delete_cancel")}
        </Button>
      )}
    />
  );
};
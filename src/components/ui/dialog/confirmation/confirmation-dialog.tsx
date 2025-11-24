import { CircleAlert, Info } from "lucide-react";
import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

export type ConfirmationDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  children?: React.ReactNode;
  cancelButton?: (onCancel: () => void) => React.ReactElement;
  icon?: "danger" | "info";
  isDone?: boolean;
};

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  triggerButton,
  confirmButton,
  title,
  body = "",
  cancelButton,
  icon = "danger",
  isDone = false,
  children,
}: ConfirmationDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const descriptionId = React.useMemo(
    () => `dialog-description-${Math.random().toString(36).slice(2, 9)}`,
    []
  );
  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(isOpen);
    } else {
      setInternalOpen(isOpen);
    }
  };
  const close = () => handleOpenChange(false);

  React.useEffect(() => {
    if (isDone) {
      handleOpenChange(false);
    }
  }, [isDone]);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent
        className="sm:max-w-[360px] rounded-none border-2 p-4 border-border"
        aria-describedby={descriptionId}
        aria-description="confirmation dialog"
      >
        <DialogHeader className="flex">
          <DialogTitle className="flex items-center text-md gap-2">
            {" "}
            {icon === "danger" && (
              <CircleAlert className="size-5 text-red-600" aria-hidden="true" />
            )}
            {icon === "info" && (
              <Info className="size-6 text-blue-600" aria-hidden="true" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center sm:mt-0 sm:text-left">
          {body && (
            <div id={descriptionId} className="mt-2">
              <p>{body}</p>
            </div>
          )}
          {children && <div className="mt-2">{children}</div>}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full flex-row">
            {cancelButton && cancelButton(close)}
            {confirmButton}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

type FormModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDone: boolean;
  triggerButton?: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const FormModal = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
  onClose,
  open,
  onOpenChange,
}: FormModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (isOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(isOpen);
    } else {
      setInternalOpen(isOpen);
      if (!isOpen) {
        onClose?.();
      }
    }
  };

  React.useEffect(() => {
    if (isDone) {
      handleOpenChange(false);
    }
  }, [isDone]);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {!isControlled && triggerButton && (
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      )}

      <DialogContent
        aria-describedby="form-modal"
        className={cn(
          "sm:max-w-lg p-0 bg-card border border-border"
        )}
      >
        <DialogHeader className="border-b flex flex-row items-center justify-between px-4 py-3">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <Button variant="plain" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="px-4 py-3">{children}</div>

        <DialogFooter className="border-t flex flex-row items-center justify-end gap-2 px-4 py-3">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          {submitButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

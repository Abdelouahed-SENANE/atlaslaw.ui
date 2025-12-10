import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";
import { Button } from "../button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer/drawer";

type FormDrawerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDone: boolean;
  triggerButton?: React.ReactElement;
  submitButton: React.ReactElement;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export const FormDrawer = ({
  title,
  children,
  isDone,
  triggerButton,
  submitButton,
  onClose,
  open,
  onOpenChange,
}: FormDrawerProps) => {
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
    <Drawer direction="right" open={actualOpen} onOpenChange={handleOpenChange}>
      {!isControlled && triggerButton && (
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      )}
      <DrawerContent
        aria-describedby="form-drawer"
        className={cn(
          "flex rounded-md  min-w-[420px] border border-border my-4    bg-card flex-col justify-between "
        )}
      >
        <DrawerHeader className="border-b flex items-center flex-row w-full justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="plain">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="w-full px-2">{children}</div>
        <DrawerFooter className="flex items-center flex-row w-full ltr:justify-end rtl:justify-start">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

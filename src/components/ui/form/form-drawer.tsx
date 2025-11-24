import * as React from "react";
import { Button } from "../button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
} from "../drawer";

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
    <Drawer open={actualOpen} onOpenChange={handleOpenChange}>
      {!isControlled && triggerButton && (
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      )}
      <DrawerContent
        aria-describedby="create-form"
        className="flex min-w-[450px] bg-card flex-col justify-between "
      >
        <div className="flex flex-col space-y-4 w-full h-full px-4 justify-center">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div>{children}</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

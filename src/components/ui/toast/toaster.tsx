"use client";

import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

export const alertStyles = {
  info: {
    icon: <Info className="text-blue-500 size-5" aria-hidden={true} />,
    text: "text-blue-500",
    bg: "bg-blue-500",
  },
  success: {
    icon: <CircleCheck className="text-green-500 size-5" aria-hidden={true} />,
    text: "text-green-500",
    bg: "bg-green-500",
  },
  error: {
    icon: <CircleX className="text-red-500 size-5" aria-hidden={true} />,
    text: "text-red-500",
    bg: "bg-red-500",
  },
  warning: {
    icon: <CircleAlert className="text-yellow-500 size-5" aria-hidden={true} />,
    text: "text-yellow-500",
    bg: "bg-yellow-500",
  },
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, type, ...props }) => (
        <div key={id} className="relative w-full">
          <Toast
            variant={"default"}
            {...props}
            className="
                  relative bg-background shadow-card max-w-xs p-2 border-border rounded-sm text-card-foreground
                  top-5 rtl:right-1/2 ltr:left-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2
                  transition-transform  duration-300 ease-out
                  opacity-0
                  data-[state=open]:translate-y-0
                  data-[state=open]:opacity-100
                  data-[state=closed]:translate-y-full
                  data-[state=closed]:opacity-0
"
          >
            <div
              className={cn(
                "h-full w-1 absolute top-0 left-0 right-0",
                alertStyles[type].bg
              )}
            ></div>
            <div className="flex w-full space-x-2 relative ">
              <div className="px-1">{alertStyles[type].icon}</div>
              <div className="flex justify-between flex-1">
                <div className="flex-1 flex flex-col items-start justify-between  ">
                  {title && (
                    <ToastTitle
                      className={cn(
                        alertStyles[type].text,
                        "text-sm font-semibold"
                      )}
                    >
                      {title}
                    </ToastTitle>
                  )}
                  {description && (
                    <ToastDescription>
                      <p className="text-xs font-medium">{description}</p>
                    </ToastDescription>
                  )}
                  {action}
                </div>
                <ToastClose className="block cursor-pointer  shrink-0 rounded-md  text-xs hover:opacity-75 text-card-foreground">
                  <X />
                </ToastClose>
              </div>
            </div>
          </Toast>
        </div>
      ))}
      <ToastViewport
        className={cn("fixed top-0 left-0 right-0 z-100 flex flex-col gap-1")}
      />
    </ToastProvider>
  );
}

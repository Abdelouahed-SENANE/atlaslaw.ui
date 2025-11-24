"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";

export const alertStyles = {
  info: {
    icon: <Info className="text-blue-500 size-6" aria-hidden={true} />,
    text: "text-blue-500",
    bg: "bg-blue-500",
  },
  success: {
    icon: <CircleCheck className="text-green-500 size-6" aria-hidden={true} />,
    text: "text-green-500",
    bg: "bg-green-500",
  },
  error: {
    icon: <CircleX className="text-red-500 size-6" aria-hidden={true} />,
    text: "text-red-500",
    bg: "bg-red-500",
  },
  warning: {
    icon: <CircleAlert className="text-yellow-500 size-6" aria-hidden={true} />,
    text: "text-yellow-500",
    bg: "bg-yellow-500",
  },
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, type, ...props }) => (
        <Toast
          key={id}
          variant={"default"}
          {...props}
          className="relative bg-card rounded-xs border-none top-0 p-3 right-0 w-full text-card-foreground data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-top-full"
        >
          <div
            className={cn(
              "h-0.5 w-full absolute top-0 left-0 right-0",
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
                      "text-base font-semibold"
                    )}
                  >
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription>
                    <p className="text-sm font-medium">{description}</p>
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
      ))}
      <ToastViewport
        className={cn("fixed top-15 right-2 z-50 flex flex-col gap-1")}
      />
    </ToastProvider>
  );
}

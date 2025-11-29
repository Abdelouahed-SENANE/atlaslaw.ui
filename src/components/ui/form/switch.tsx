import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { type UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from "./field-wrapper";

export type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitives.Root
> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration?: Partial<UseFormRegisterReturn>;
  };

const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, label, error, registration, ...props }, ref) => {
  return (
    <FieldWrapper label={label} error={error}>
      <SwitchPrimitives.Root
        {...props}
        ref={ref}
        name={registration?.name}
        onBlur={registration?.onBlur}
        onCheckedChange={(checked) => {
          registration?.onChange?.({
            target: {
              name: registration.name,
              value: checked ? "1" : "0",
            },
          } as any);
        }}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          className
        )}
      >
        <SwitchPrimitives.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
      </SwitchPrimitives.Root>
    </FieldWrapper>
  );
});

Switch.displayName = "Switch";

export { Switch };

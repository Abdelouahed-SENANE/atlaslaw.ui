import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration?: Partial<UseFormRegisterReturn>;
  };

const RadioInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, registration, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error}>
        <label className="relative w-full cursor-pointer">
          <input
            ref={ref}
            type="radio"
            className="peer sr-only"
            {...registration}
            {...props}
          />

          {/* Custom box */}
          <div
            className={`
              flex items-center w-full border rounded-sm px-3 py-2
              bg-card text-sm font-medium transition-all
              peer-checked:border-primary
              peer-checked:bg-primary/10
              peer-checked:text-primary
            `}
          >
            {label}
          </div>
         
        </label>
      </FieldWrapper>
    );
  }
);

RadioInput.displayName = "RadioInput";

export { RadioInput };

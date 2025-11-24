import * as React from "react";
import { type FieldError } from "react-hook-form";

import { InputError } from "./input-error";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | string;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { error, children } = props;
  return (
    <>
      <div className="mt-1 w-full">{children}</div>
      <InputError errorMessage={typeof error == 'string' ? error : error?.message} />
    </>
  );
};

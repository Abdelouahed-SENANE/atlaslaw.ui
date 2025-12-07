"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";
import { cn } from "@/lib/utils";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export interface InputDateProps extends FieldWrapperPassThroughProps {
  label?: string;
  onChange: (newDate: Date | undefined) => void;
  val?: Date;
  placeholder?: string;
}
export const DateInput = ({
  onChange,
  val,
  placeholder,
  label,
  error,
}: InputDateProps) => {
  const normalize = (v: any): Date | undefined => {
    if (!v) return undefined;
    if (v instanceof Date) return v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const initial = normalize(val);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initial);

  return (
    <FieldWrapper label={label} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="plain"
            id="date"
            data-state={open ? "open" : "closed"}
            className={cn(
              "peer cursor-pointer relative text-card-foreground flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50",
              error && "border-error/80 ring-3 ring-error/40"
            )}
          >
            {date ? (
              date.toLocaleDateString()
            ) : (
              <span className="text-foreground/50">{placeholder}</span>
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0 bg-card"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date: Date | undefined) => {
              onChange(date);
              setDate(date);
              setOpen(false);
            }}
            required={false}
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
};

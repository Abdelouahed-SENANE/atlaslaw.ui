import React, { useEffect, useState } from "react";
import { useDebouce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type InputSearchProps = {
  value?: string;
  onChange: (query: string) => void;
  delay?: number;
  onClick?: () => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
};

export const SearchInput = React.forwardRef<HTMLInputElement, InputSearchProps>(
  (
    {
      value = "",
      onChange,
      delay,
      onClick,
      placeholder = "Search",
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(value);
    const debounced = useDebouce<string>(inputValue, delay);

    useEffect(() => {
      if (debounced !== value) {
        onChange(debounced);
      }
    }, [debounced]);

    useEffect(() => {
      if (value !== inputValue) {
        setInputValue(value);
      }
    }, [value]);

    return (
      <div
        className={cn(
          "relative  h-9 transition-all duration-300 w-full",
          className
        )}
      >
        <Search className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-card-foreground/70" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={inputValue ?? ""}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn(
            "w-full h-full ltr:pl-8 rtl:pr-8 rtl:pl-2 ltr:pr-2 rounded-sm border border-border bg-background outline-none text-foreground text-sm font-medium placeholder:text-card-foreground/70 transition-all duration-300",
            "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary"
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

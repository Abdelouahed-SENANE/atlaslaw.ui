"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command/command";

import { ScrollArea } from "@/components/ui/scroll-area";
import i18n from "@/config/i18n";
import { cn } from "@/lib/utils";
import { BaseOption, Lang } from "@/types/api";
import { Check, ChevronDown } from "lucide-react";
import { Spinner } from "../spinner";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export interface AutocompleteProps<T extends BaseOption>
  extends FieldWrapperPassThroughProps {
  value?: string;
  initialOption?: T;
  onChange: (value?: string, option?: T) => void;

  items: T[];
  term: string;
  setTerm: (val: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;

  renderOption?: (o: T) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

function AutocompleteComponent<T extends BaseOption>({
  label,
  error,
  value,
  onChange,
  initialOption,
  items,
  term,
  setTerm,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  isLoading,

  renderOption,
  renderFooter,
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false);
  const lang = i18n.language;

  // Cache selected value
  const [internalSelected, setInternalSelected] = React.useState<T | undefined>(
    initialOption
  );
  React.useEffect(() => {
    if (!open) {
      setTerm("");
    }
  }, [open]);

  React.useEffect(() => {
    if (!internalSelected && initialOption) {
      setInternalSelected(initialOption);
    }
  }, [initialOption, internalSelected]);

  // Memoized label resolver
  const getLabel = React.useCallback(
    (opt: T) => {
      if (typeof opt.label === "string") return opt.label;
      return opt.label[lang as Lang] ?? opt.label["fr"];
    },
    [lang]
  );

  //Memoized selectedOption calculation
  const selectedOption = React.useMemo(() => {
    if (!value) return undefined;

    const fromList = items.find((i) => i.value === value);
    if (fromList) return fromList;

    if (initialOption?.value === value) return initialOption;
    if (internalSelected?.value === value) return internalSelected;

    return undefined;
  }, [value, items, initialOption, internalSelected]);

  // Memoized select handler
  const handleSelect = React.useCallback(
    (opt: T) => {
      setInternalSelected(opt);
      onChange(opt.value, opt);
      setOpen(false);
    },
    [onChange]
  );
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const hasUserScrolledRef = React.useRef(false);

  React.useEffect(() => {
    if (!open) return;

    const raf = requestAnimationFrame(() => {
      const viewport = document.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLDivElement | null;

      if (!viewport) return;

      scrollRef.current = viewport;

      const onScroll = () => {
        hasUserScrolledRef.current = true;
      };

      viewport.addEventListener("scroll", onScroll);

      return () => {
        viewport.removeEventListener("scroll", onScroll);
      };
    });

    return () => cancelAnimationFrame(raf);
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      hasUserScrolledRef.current = false;
    }
  }, [open]);

  const optionList = React.useMemo(
    () =>
      items.map((opt) => (
        <CommandItem
          key={opt.value}
          value={opt.value}
          onSelect={() => handleSelect(opt)}
        >
          {renderOption ? renderOption(opt) : getLabel(opt)}
          <Check
            className={`ml-auto h-4 w-4 ${
              selectedOption?.value === opt.value ? "opacity-100" : "opacity-0"
            }`}
          />
        </CommandItem>
      )),
    [items, handleSelect, getLabel, renderOption, selectedOption]
  );

  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  // focus search input when popover opens
  React.useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  return (
    <FieldWrapper label={label} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            data-state={open ? "open" : "closed"}
            className={cn(
              "peer cursor-pointer relative flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50",
              error && "border-error/80 ring-3 ring-error/40"
            )}
          >
            {selectedOption ? (
              <span>
                {renderOption
                  ? renderOption(selectedOption)
                  : getLabel(selectedOption)}
              </span>
            ) : (
              <span className="text-foreground/50">
                {placeholder ?? "Select..."}
              </span>
            )}

            <ChevronDown className="ml-2 size-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
          <Command shouldFilter={false}>
            <CommandInput
              ref={searchInputRef}
              placeholder={
                searchPlaceholder ?? "Type to search more results..."
              }
              value={term}
              autoFocus
              onValueChange={setTerm}
            />

            <CommandList>
              <ScrollArea className=" min-h-10  overflow-y-auto ">
                <CommandGroup>
                  {isLoading ? <Spinner size="sm" /> : optionList}
                </CommandGroup>
                {items.length === 0 && !isLoading && (
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-muted-foreground">
                      {emptyMessage}
                    </span>
                  </div>
                )}
              </ScrollArea>
              {renderFooter && (
                <div className="border-t px-2 py-2">{renderFooter()}</div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

export const Autocomplete = React.memo(
  AutocompleteComponent
) as typeof AutocompleteComponent;

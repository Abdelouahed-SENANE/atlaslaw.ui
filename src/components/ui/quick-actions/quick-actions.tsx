import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuickAction = {
  label: string;
  value: "view" | "delete" | "edit" | "manage_permissions";
  icon?: React.ReactNode;
};

type EntityActionsProps = {
  id: string;
  actions: QuickAction[];
  onAction?: (action: QuickAction["value"], id: string) => void;
};

export const QuickActions = ({ id, actions, onAction }: EntityActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-foreground hover:bg-primary! hover:text-primary-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="max-w-lg rounded-sm shadow-md p-1 bg-background"
      >
        {actions.map(({ label, value, icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={(e) => {
              e.preventDefault();
              onAction?.(value, id);
            }}
            className={cn(
              "group flex rtl:flex-row-reverse items-center gap-2 text-sm cursor-pointer rounded-none transition-colors",
              "hover:bg-primary! hover:text-primary-foreground"
            )}
          >
            {icon && <span className="text-muted-foreground">{icon}</span>}
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

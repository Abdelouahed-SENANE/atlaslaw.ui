import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown/dropdown-menu";
import { PermissionCode } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

export type QuickAction = {
  label: string;
  value: "view" | "delete" | "edit" | "manage_permissions";
  icon?: React.ReactNode;
  permission: PermissionCode;
};

type EntityActionsProps = {
  id: string;
  actions: QuickAction[];
  onAction?: (action: QuickAction["value"], id: string) => void;
};

export const QuickActions = ({ id, actions, onAction }: EntityActionsProps) => {
  if (!actions || actions.length === 0) return null;
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

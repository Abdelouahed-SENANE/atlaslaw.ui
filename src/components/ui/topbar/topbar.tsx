import { Bell, Menu, Plus } from "lucide-react";
import { Button } from "../button";
import { useSidebar } from "../sidebar";
import { cn } from "@/lib/utils";
import { UserNavgation } from "../user-navigation";
import { ThemeToggle } from "../theme";
import { Locale } from "../locale/locale";
import { Input } from "../form";

type TopbarProps = {
  className?: string;
};
export const Topbar = ({ className }: TopbarProps) => {
  const { setCollapsed, isCollapsed } = useSidebar();
  return (
    <div
      className={cn(
        "h-[var(--topbar-height)] z-10 border-b bg-background px-2 ml-auto fixed inset-0 transition-[width] duration-300",
        isCollapsed
          ? "w-[calc(100%-var(--sidebar-collapsed))]"
          : "w-[calc(100%-var(--sidebar-expended))]",
        className
      )}
    >
      <nav className="px-2 flex items-center justify-between h-full">
        <ul className="flex items-center">
          <li>
            <Button
              onClick={() => setCollapsed(!isCollapsed)}
              variant={"plain"}
              className="bg-transparent text-foreground hover:bg-none"
            >
              <Menu className="size-4" />
            </Button>
          </li>
          <li>
            <Button
              variant={"plain"}
              className="bg-primary/10 text-primary hover:bg-none"
            >
              <Plus />
              <span>Create Blog</span>
            </Button>
          </li>
        </ul>

        <ul className="flex items-center space-x-2">
          <li className="min-w-xs">
            <Input placeholder="Search..." className="w-sm"/>
          </li>
          <li>
            <Locale />
          </li>
          <li>
            <ThemeToggle />
          </li>
          <li>
            <Button
              variant={"plain"}
              className="bg-transparent text-foreground hover:bg-none rounded-full hover:bg-primary/10 size-9"
            >
              <Bell className="size-4.5" />
            </Button>
          </li>
          <li>
            <UserNavgation />
          </li>
        </ul>
      </nav>
    </div>
  );
};

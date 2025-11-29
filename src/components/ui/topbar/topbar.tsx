import { Permission, useAuthorization } from "@/lib/authorization";
import { cn } from "@/lib/utils";
import { Bell, Menu, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import { Input } from "../form";
import { SwitchLanguage } from "../language/switch-language";
import { useSidebar } from "../sidebar";
import { ThemeToggle } from "../theme";
import { UserNavgation } from "../user-navigation";

type TopbarProps = {
  className?: string;
};
export const Topbar = ({ className }: TopbarProps) => {
  const { setCollapsed, isCollapsed } = useSidebar();
  const { hasPermission } = useAuthorization();
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "h-(--topbar-height) z-10 border-b bg-background px-2 ms-auto fixed inset-0 transition-[width] duration-300",
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
          {hasPermission({ permission: Permission.CREATE_TENANT }) && (
            <li>
              <Button
                variant={"plain"}
                className="bg-primary/10 text-primary hover:bg-none"
              >
                <Plus />
                <span>{t("menu.create_tenant")}</span>
              </Button>
            </li>
          )}
        </ul>

        <ul className="flex items-center space-x-2">
          <li className="min-w-xs">
            <Input placeholder="Search..." className="w-sm" />
          </li>
          <li>
            <SwitchLanguage />
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

import { paths } from "@/config/paths";
import { ROLES, useAuthorization } from "@/lib/auth/authorization";
import { cn } from "@/lib/utils";
import { Layout } from "lucide-react";
import React, { Fragment } from "react";
import { Sidebar, useSidebar } from "../ui/sidebar";
import { Topbar } from "../ui/topbar/topbar";

export const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const { checkAccess } = useAuthorization();
  const { isCollapsed } = useSidebar();
  const items = [
    ...(checkAccess({ allowedRoles: [ROLES.ADMIN] })
      ? [
          {
            label: "Dashboard",
            url: paths.admin.dashboard.route() + "/*",
            icon: <Layout className="size-4" />,
          },
        ]
      : []),
    ...(checkAccess({ allowedRoles: [ROLES.USER] }) ? [] : []),
  ];

  return (
    <Fragment>
      <div className="min-h-screen w-full overflow-hidden bg-background">
        <Sidebar.Root
          className={cn(
            "transition-[transform,width] duration-300 ease-in-out",
            isCollapsed
              ? "w-[var(--sidebar-collapsed-width)]"
              : "w-[var(--sidebar-width)]"
          )}
        >
          <Sidebar.Brand
            lightLogo={<img src="/assets/logo-light.png" alt="Light Logo" />}
            darkLogo={<img src="/assets/logo-dark.png" alt="Dark Logo" />}
            smallLogo={
              <img src="/assets/logo-sm.png" alt="Small Logo" className="h-6" />
            }
          />
          <Sidebar.Body>
            <Sidebar.Menu className="mb-4">
              <Sidebar.Label title="Navigation" />
              <Sidebar.Item>
                {items.map((item, index) => (
                  <Sidebar.Link
                    className=" transition-colors"
                    key={index}
                    title={item.label}
                    to={item.url}
                    icon={item.icon}
                  />
                ))}
              </Sidebar.Item>
            </Sidebar.Menu>
          </Sidebar.Body>
        </Sidebar.Root>
        <main className={cn("flex-1 relative")}>
          <Topbar />

          <div
            className={cn(
              "ml-auto transition-[width] h-[calc(100%-var(--topbar-height))] duration-300 flex flex-col  w-full mt-[var(--topbar-height)] px-2",
              isCollapsed
                ? "w-[calc(100%-var(--sidebar-collapsed))]"
                : "w-[calc(100%-var(--sidebar-expended))]"
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </Fragment>
  );
};

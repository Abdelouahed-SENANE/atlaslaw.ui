import { paths } from "@/config/paths";
import { Roles, useAuthorization } from "@/lib/auth/authorization";
import { cn } from "@/lib/utils";
import { Building, Layout, Users2 } from "lucide-react";
import React, { Fragment } from "react";
import { Sidebar, useSidebar } from "../ui/sidebar";
import { Topbar } from "../ui/topbar/topbar";

export const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const { checkAccess } = useAuthorization();
  const { isCollapsed } = useSidebar();

  const items = [
    ...(checkAccess({ allowedRoles: [Roles.SUPER_ADMIN] })
      ? [
          {
            label: "Dashboard",
            url: paths.admin.dashboard.route(),
            icon: <Layout className="size-4" />,
          },
          {
            label: "Tenants",
            url: paths.admin.tenants.root,
            icon: <Building className="size-4" />,
            sublinks: [
              { title: "List Tenants", to: paths.admin.tenants.list.route() },
              { title: "New Tenant", to: paths.admin.tenants.new.route() },
            ],
          },
          {
            label: "Users",
            url: paths.admin.users.root,
            icon: <Users2 className="size-4" />,
            sublinks: [
              { title: "List Users", to: paths.admin.users.list.route() },
              { title: "New User", to: paths.admin.users.new.route() },
            ],
          },
        ]
      : []),
    ...(checkAccess({ allowedRoles: [Roles.USER] }) ? [] : []),
  ];

  return (
    <Fragment>
      <div className="min-h-screen w-full overflow-hidden bg-background">
        <Sidebar.Root
          className={cn(
            "transition-[transform,width] duration-300 ease-in-out",
            isCollapsed
              ? "w-(--sidebar-collapsed-width)"
              : "w-(--sidebar-width)"
          )}
        >
          <Sidebar.Brand
            pathLight={"/assets/logo-light.png"}
            pathDark={"/assets/logo-dark.png"}
            pathSmall={"/assets/logo-sm.png"}
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
                    items={item.sublinks}
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
              "ms-auto transition-[width] h-[calc(100%-var(--topbar-height))] duration-300 flex flex-col w-full mt-(--topbar-height) px-2",
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

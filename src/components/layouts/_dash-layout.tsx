import { paths } from "@/config/paths";
import { Scope } from "@/lib/authorization";
import { useAuthorization } from "@/lib/authorization/authorization";
import { cn } from "@/lib/utils";
import { Building, Fingerprint, Layout, Users2 } from "lucide-react";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { RouterLink } from "../ui/link";
import { Sidebar, useSidebar } from "../ui/sidebar";
import { Topbar } from "../ui/topbar/topbar";

export const DashLayout = ({
  children,
  title,
  desc,
  breadcrumbs = [],
}: {
  children: React.ReactNode;
  title?: string;
  desc?: string;
  breadcrumbs?: { label: string; url: string; active?: boolean }[];
}) => {
  const { hasScope } = useAuthorization();
  const { t } = useTranslation();
  const { isCollapsed } = useSidebar();

  const ADMIN_ROUTES = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      icon: <Layout className="size-4" />,
    },
    {
      label: t("menu.tenants"),
      url: paths.admin.tenants.root,
      icon: <Building className="size-4" />,
      sublinks: [
        {
          title: t("menu.list_tenants"),
          to: paths.admin.tenants.list.route(),
        },
        {
          title: t("menu.create_tenant"),
          to: paths.admin.tenants.new.route(),
        },
      ],
    },
    {
      label: t("menu.users"),
      url: paths.admin.users.root,
      icon: <Users2 className="size-4" />,
      sublinks: [
        {
          title: t("menu.list_users"),
          to: paths.admin.users.list.route(),
        },
        {
          title: t("menu.create_user"),
          to: paths.admin.users.new.route(),
        },
      ],
    },
    {
      label: t("menu.rbac"),
      url: paths.admin.rbac.root,
      icon: <Fingerprint className="size-4" />,
      sublinks: [
        {
          title: t("menu.list_roles"),
          to: paths.admin.rbac.roles.list.route(),
        },
        {
          title: t("menu.create_role"),
          to: paths.admin.rbac.roles.new.route(),
        },
      ],
    },
  ];

  const items = [
    ...(hasScope({ scope: Scope.SYSTEM }) ? ADMIN_ROUTES : []),
    ...(hasScope({ scope: Scope.TENANT }) ? [] : []),
  ];

  return (
    <Fragment>
      <div className="min-h-screen w-full overflow-hidden relative bg-background">
        <Sidebar.Root
          className={cn(
            "transition-[transform,width] duration-200 ease-in-out",
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
              <Sidebar.Label title={t("menu.navigation")} />
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
              "ms-auto transition-[width] h-[calc(100%-var(--topbar-height))] duration-300 flex flex-col w-full mt-(--topbar-height) p-2",
              isCollapsed
                ? "w-[calc(100%-var(--sidebar-collapsed))]"
                : "w-[calc(100%-var(--sidebar-expended))]"
            )}
          >
            <div className="mb-8 mt-4 space-y-1">
              <Breadcrumb>
                <BreadcrumbList className="flex items-center">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <RouterLink
                            className={cn(
                              "hover:no-underline text-foreground hover:text-primary text-sm font-bold",
                              item.active && "text-primary"
                            )}
                            to={item.active ? "#" : item.url}
                          >
                            {item.label}
                          </RouterLink>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className=" text-card-foreground/60 ">{desc}</p>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </Fragment>
  );
};

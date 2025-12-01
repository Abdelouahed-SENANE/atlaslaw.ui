import { useMemo } from "react";

import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/lib/auth";
import { Authorization, Scope } from "@/lib/authorization";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalError } from "./routes/errors/global-err";
import RouteError from "./routes/errors/route-err";
import LoginPage from "./routes/public/auth/login";
import RegisterPage from "./routes/public/auth/register";

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const LoadingScreen = (
  <div className="flex h-screen w-screen items-center text-primary justify-center">
    <Spinner />
  </div>
);

export const createAppRouter = (queryClient: QueryClient) => {
  return createBrowserRouter([
    {
      id: "root",
      path: "/",
      ErrorBoundary: GlobalError,
      children: [
        {
          path: paths.home.root,
          lazy: () => import("./routes/public/home").then(convert(queryClient)),
          HydrateFallback: () => LoadingScreen,
        },
        {
          path: paths.login.root,
          Component: () => <LoginPage />,
        },
        {
          path: paths.register.root,
          Component: () => <RegisterPage />,
        },
        // Admin Routes
        {
          path: paths.admin.root,
          ErrorBoundary: RouteError,
          HydrateFallback: () => LoadingScreen,

          lazy: async () => {
            const [{ default: AdminRoot }] = await Promise.all([
              import("./routes/secure/admin"),
            ]);
            return {
              element: (
                <ProtectedRoute>
                  <Authorization scope={Scope.SYSTEM}>
                    <AdminRoot />
                  </Authorization>
                </ProtectedRoute>
              ),
            };
          },
          children: [
            {
              HydrateFallback: () => LoadingScreen,
              path: paths.admin.dashboard.root,
              lazy: () =>
                import("./routes/secure/admin/dashboard").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.admin.tenants.root,
              HydrateFallback: () => LoadingScreen,
              children: [
                {
                  index: true, // instead of path: ""
                  lazy: () =>
                    import("./routes/secure/admin/tenants/tenants").then(
                      convert(queryClient)
                    ),
                },
                {
                  path: paths.admin.tenants.new.root, // "create"
                  lazy: () =>
                    import("./routes/secure/admin/tenants/new-tenant").then(
                      convert(queryClient)
                    ),
                },
              ],
            },

            {
              path: paths.admin.rbac.root, // "rbac"
              children: [
                {
                  path: paths.admin.rbac.roles.list.root, // "roles"
                  children: [
                    {
                      index: true,
                      lazy: () =>
                        import("./routes/secure/admin/rbac/roles").then(
                          convert(queryClient)
                        ),
                    },
                    {
                      path: paths.admin.rbac.roles.new.root, // "new"
                      lazy: () =>
                        import("./routes/secure/admin/rbac/new-role").then(
                          convert(queryClient)
                        ),
                    },
                    {
                      path: paths.admin.rbac.roles.permissions.root, // "new"
                      lazy: () =>
                        import("./routes/secure/admin/rbac/role-permissions").then(
                          convert(queryClient)
                        ),
                    },
                  ],
                },
              ],
            },
          ],
        },

        // Tenant Routes
        {
          path: paths.tenant.root,
          ErrorBoundary: RouteError,
          HydrateFallback: () => LoadingScreen,
          lazy: async () => {
            const [{ default: TenantRoot }] = await Promise.all([
              import("./routes/secure/tenant"),
            ]);
            return {
              element: (
                <ProtectedRoute>
                  <Authorization scope={Scope.TENANT}>
                    <TenantRoot />
                  </Authorization>
                </ProtectedRoute>
              ),
            };
          },
        },
        {
          path: "*",
          lazy: () => import("./routes/errors/404").then(convert(queryClient)),
        },
      ],
    },
  ]);
};

export const Router = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};

import { useMemo } from "react";

import { AuthLayout } from "@/components/layouts/_auth-layout";
import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/lib/auth";
import { Authorization, Scope } from "@/lib/authorization";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./routes/auth/login";
import RegisterPage from "./routes/auth/register";
import { GlobalError } from "./routes/errors/global-err";
import RouteError from "./routes/errors/route-err";

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
          lazy: () => import("./routes/home").then(convert(queryClient)),
          HydrateFallback: () => LoadingScreen,
        },
        {
          path: paths.login.root,
          element: (
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          ),
        },
        {
          path: paths.register.root,
          element: (
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          ),
        },
        // Admin Routes
        {
          path: paths.admin.root,
          ErrorBoundary: RouteError,
          HydrateFallback: () => LoadingScreen,

          lazy: async () => {
            const [{ default: AdminRoot }] = await Promise.all([
              import("./routes/scopes/system"),
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
                import("./routes/scopes/system/dashboard").then(
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
                    import("./routes/scopes/system/tenants/list-tenants").then(
                      convert(queryClient)
                    ),
                },
                {
                  path: paths.admin.tenants.new.root, // "create"
                  lazy: () =>
                    import("./routes/scopes/system/tenants/new-tenant").then(
                      convert(queryClient)
                    ),
                },
                {
                  path: paths.admin.tenants.edit.root, // "create"
                  lazy: () =>
                    import("./routes/scopes/system/tenants/edit-tenant").then(
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
                        import("./routes/scopes/system/rbac/list-roles").then(
                          convert(queryClient)
                        ),
                    },
                    {
                      path: paths.admin.rbac.roles.new.root, // "new"
                      lazy: () =>
                        import("./routes/scopes/system/rbac/new-role").then(
                          convert(queryClient)
                        ),
                    },
                    {
                      path: paths.admin.rbac.roles.edit.root, // "new"
                      lazy: () =>
                        import("./routes/scopes/system/rbac/edit-role").then(
                          convert(queryClient)
                        ),
                    },
                    {
                      path: paths.admin.rbac.roles.permissions.root, // "new"
                      lazy: () =>
                        import(
                          "./routes/scopes/system/rbac/role-permissions"
                        ).then(convert(queryClient)),
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
              import("./routes/scopes/tenant"),
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
          children: [
            {
              HydrateFallback: () => LoadingScreen,
              path: paths.tenant.dashboard.root,
              lazy: () =>
                import("./routes/scopes/tenant/dashboard").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.tenant.employees.root,
              HydrateFallback: () => LoadingScreen,
              children: [
                {
                  index: true, // instead of path: ""
                  lazy: () =>
                    import(
                      "./routes/scopes/tenant/employees/list-employees"
                    ).then(convert(queryClient)),
                },
                {
                  path: paths.tenant.employees.new.root, // "create"
                  lazy: () =>
                    import(
                      "./routes/scopes/tenant/employees/new-employee"
                    ).then(convert(queryClient)),
                },
                {
                  path: paths.tenant.employees.edit.root, // "create"
                  lazy: () =>
                    import(
                      "./routes/scopes/tenant/employees/edit-employee"
                    ).then(convert(queryClient)),
                },
              ],
            },
          ],
        },
        {
          path: paths.suspended.root,
          lazy: () => import("./routes/suspended").then(convert(queryClient)),
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

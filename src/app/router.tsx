import { useMemo } from "react";

import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
import { ProtectedRoute } from "@/lib/auth";
import { Authorization, Roles } from "@/lib/auth/authorization";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
      path: paths.home.root,
      lazy: () => import("./routes/public/home").then(convert(queryClient)),
      HydrateFallback: () => LoadingScreen,
    },
    {
      path: paths.login.root,
      lazy: () => import("./routes/auth/login").then(convert(queryClient)),
      HydrateFallback: () => LoadingScreen,
    },
    {
      path: paths.admin.root,
      HydrateFallback: () => LoadingScreen,
      lazy: async () => {
        const [{ default: AdminRoot }] = await Promise.all([
          import("./routes/admin/_root"),
        ]);
        return {
          element: (
            <ProtectedRoute>
              <Authorization allowedRoles={[Roles.SUPER_ADMIN]}>
                <AdminRoot />
              </Authorization>
            </ProtectedRoute>
          ),
        };
      },
      children: [
        {
          path: paths.admin.dashboard.root, // relative path
          lazy: () =>
            import("./routes/admin/dashboard").then(convert(queryClient)),
          HydrateFallback: () => LoadingScreen,
        },
        {
          path: paths.admin.tenants.root, // "tenants"
          children: [
            {
              index: true, // instead of path: ""
              lazy: () =>
                import("./routes/admin/tenants").then(convert(queryClient)),
              HydrateFallback: () => LoadingScreen,
            },
            {
              path: paths.admin.tenants.new.root, // "create"
              lazy: () =>
                import("./routes/admin/tenants/new-tenant").then(
                  convert(queryClient)
                ),
              HydrateFallback: () => LoadingScreen,
            },
          ],
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

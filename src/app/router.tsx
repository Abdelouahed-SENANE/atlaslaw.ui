import { useMemo } from "react";

import { Spinner } from "@/components/ui/spinner";
import { paths } from "@/config/paths";
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

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.login.root,
      lazy: () => import("./routes/auth/login").then(convert(queryClient)),
      HydrateFallback: () => (
        <div className="flex h-screen w-screen items-center text-primary justify-center">
          <Spinner />
        </div>
      ),
    },
    {
      path: paths.home.root,
      lazy: () => import("./routes/public/home").then(convert(queryClient)),
      HydrateFallback: () => (
        <div className="flex h-screen w-screen items-center text-primary justify-center">
          <Spinner />
        </div>
      ),
    },
  ]);

export const Router = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};

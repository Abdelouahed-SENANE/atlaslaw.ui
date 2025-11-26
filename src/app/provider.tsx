import { ThemeProvider } from "@/components/ui/theme/provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { env } from "@/config/env";
import { queryConfig } from "@/config/react-query";
import { AuthLoader } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig })
  );

  const isDev = env.logging.mode === "dev" ? true : false;

  return (
    <React.Suspense>
      <ErrorBoundary FallbackComponent={() => <div>error</div>}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <QueryClientProvider client={queryClient}>
            <Toaster />
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
            <AuthLoader
              renderLoading={() => (
                <div className="bg-background w-screen h-screen"></div>
              )}
            >
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};

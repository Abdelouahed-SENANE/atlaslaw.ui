import { ThemeProvider } from "@/components/ui/theme/provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { env } from "@/config/env";
import { queryConfig } from "@/config/react-query";
import { AuthLoader } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { GlobalError } from "./routes/errors/global-err";

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  const [queryClient] = React.useState(
    () => new QueryClient({ defaultOptions: queryConfig })
  );

  const isDev = env.logging.mode === "dev" ? true : false;

  return (
    <ErrorBoundary FallbackComponent={GlobalError}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <QueryClientProvider client={queryClient}>
            <Toaster />
            {/* {isDev && <ReactQueryDevtools initialIsOpen={false} />} */}
            <AuthLoader
              renderError={() => <div>Something went wrong</div>}
              renderLoading={() => <></>}
            >
              {children}
            </AuthLoader>
          </QueryClientProvider>
        </ThemeProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

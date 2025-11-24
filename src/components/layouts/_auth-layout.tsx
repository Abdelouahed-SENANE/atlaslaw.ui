import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { useTokenStore } from "@/store/token-store";
import React from "react";
import { Navigate, useSearchParams } from "react-router";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const hasToken = useTokenStore((s) => !!s.access_token) as boolean;
  const user = useUser({ enabled: hasToken });

  if (user.data) {
    return <Navigate to={redirectTo ? redirectTo : paths.home.root} replace />;
  }

  if (hasToken && (user.isLoading || user.isFetching)) {
    return <>Loading...</>;
  }
  return (
    <div className="h-screen w-screen flex  items-center justify-center">
      {children}
    </div>
  );
};

import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import React from "react";
import { Navigate, useSearchParams } from "react-router";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const user = useUser();
  if (user.data) {
    return <Navigate to={redirectTo ? redirectTo : paths.home.root} replace />;
  }

  return (
    <div className="h-screen w-screen flex  items-center justify-center">
      {children}
    </div>
  );
};

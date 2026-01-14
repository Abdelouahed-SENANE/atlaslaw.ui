import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { Scope } from "@/lib/authorization";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "../ui/spinner";
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isFetched } = useUser();
  const navigate = useNavigate();

  if (!isFetched || isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  useEffect(() => {
    if (!user) return;

    const destination =
      user.scope === Scope.SYSTEM
        ? paths.admin.dashboard.route()
        : paths.tenant.dashboard.route();

    navigate(destination);
  }, [user]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
};

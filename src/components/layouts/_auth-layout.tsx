import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { Scope } from "@/lib/authorization";
import React from "react";
import { useNavigate } from "react-router";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();

  // ---------------------------------------
  // 1. COMPUTE EVERYTHING FIRST — NO RETURNS
  // ---------------------------------------
  const isGuest = !isLoading && !user;

  const destination = React.useMemo(() => {
    if (!user) return null;

    if (user.scope === Scope.SYSTEM) {
      return paths.admin.dashboard.route();
    }

    if (user.scope === Scope.TENANT) {
      if (!user.tenant) return null;

      if (user.tenant.status === "active") {
        return paths.tenant.dashboard.route();
      }

      if (user.tenant.status === "suspended") {
        return paths.suspended.route();
      }
    }

    return paths.home.route();
  }, [user]);

  // ---------------------------------------
  // 2. REDIRECT EFFECT — ALWAYS SAFE
  // ---------------------------------------
  React.useEffect(() => {
    if (destination) {
      navigate(destination, { replace: true });
    }
  }, [destination, navigate]);

  // ---------------------------------------
  // 3. SINGLE RETURN (NO EARLY RETURNS!)
  // ---------------------------------------
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {/* Guest → show login */}
      {isGuest && children}

      {/* Loading state */}
      {isLoading ||
      (!isGuest && !destination) ? (
        <span className="text-muted-foreground">Loading...</span>
      ) : null}

      {/* Redirect case → render nothing */}
      {destination ? null : null}
    </div>
  );
};

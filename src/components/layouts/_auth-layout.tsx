import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { Scope } from "@/lib/authorization";
import { Redirect } from "@/utils/redirect";
import React from "react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  // const [searchParams] = useSearchParams();
  // const redirectTo = searchParams.get("redirect");

  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-screen  w-screen flex items-center justify-center">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  console.log("user", user);
  
  // 3. Redirect authenticated user
  let destination = undefined;
  if (user.scope === Scope.TENANT && !user.tenant) {
    destination = paths.home.route();
  }
  if (user.scope === Scope.SYSTEM ) {
    destination = paths.admin.dashboard.route();
  }
  if (user.scope === Scope.TENANT && user.tenant?.status === "active" && user.tenant) {
    destination = paths.tenant.dashboard.route();
  }
  if (user.scope === Scope.TENANT && user.tenant?.status === "suspended") {
    destination = paths.suspended.route();
  }

  // 4. Redirect authenticated user
  return <Redirect to={destination ?? paths.home.route()} />;
};

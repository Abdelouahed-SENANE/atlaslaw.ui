import * as React from "react";

import { useUser } from "../auth/authentication";
import { PermissionCode, Scope } from "./constants";
import { paths } from "@/config/paths";
import { Navigate } from "react-router-dom";

// export const POLICIES = {
//   "comment:delete": (user: User) => {
//     if (user.role === "ADMIN") {
//       return true;
//     }

//     // if (user.role === 'USER' && comment.author?.id === user.id) {
//     //   return true;
//     // }

//     return false;
//   },
// };

export const useAuthorization = () => {
  let user = useUser();

  if (!user.data) {
    throw Error("User does not exist!");
  }

  const unauthorized =
    !user.data ||
    !user.data.scope ||
    !Array.isArray(user.data.permissions) ||
    user.data.permissions.length === 0;

  const hasScope = React.useCallback(
    ({ scope }: { scope: Scope }) => {
      if (scope && user.data) {
        return user.data.scope === scope;
      }
      return true;
    },
    [user.data]
  );

  const hasPermission = React.useCallback(
    ({ permission }: { permission: PermissionCode }) => {
      if (user.data) {
        return user.data.permissions.includes(permission);
      }
      return false;
    },
    [user.data]
  );

  return { hasScope, hasPermission, unauthorized };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      scope: Scope;
      permission?: never;
    }
  | {
      scope?: never;
      permission: PermissionCode;
    }
);

export const Authorization = ({
  permission,
  scope,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { hasScope, hasPermission, unauthorized } = useAuthorization();
  if (unauthorized) {
    return <Navigate to={paths.home.root} />;
  }
  let canAccess = false;

  if (scope) {
    canAccess = hasScope({ scope });
  }

  if (permission) {
    canAccess = hasPermission({ permission });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

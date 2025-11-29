import * as React from "react";

import { useUser } from "../auth/authentication";
import { Permission, Scope } from "./constants";

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
    ({ permission }: { permission:  Permission }) => {
      if (user.data) {
        return user.data.permissions.includes(permission);
      }
      return false;
    },
    [user.data]
  );

  return { hasScope, hasPermission };
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
      permission: Permission;
    }
);

export const Authorization = ({
  permission,
  scope,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { hasScope , hasPermission } = useAuthorization();

  let canAccess = false;

  if (scope) {
    canAccess = hasScope({ scope });
  }

  if (permission) {
    canAccess = hasPermission({ permission });
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

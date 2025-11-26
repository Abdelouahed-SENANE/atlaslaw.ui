import * as React from "react";

import { useUser } from "./authentication";

export enum Roles {
  SUPER_ADMIN = "super_admin",
  USER = "USER",
}


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

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: Roles[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return user.data.roles.some((role) =>
          allowedRoles.includes(role)
        );
      }

      return true;
    },
    [user.data]
  );

  return { checkAccess, roles: user.data.roles };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: Roles[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== "undefined") {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};

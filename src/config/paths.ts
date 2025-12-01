export const paths = {
  home: {
    root: "/",
    route: () => "/",
  },
  profile: {
    root: "/profile",
    route: () => "/profile",
  },
  settings: {
    root: "/settings",
    route: () => "/settings",
  },
  login: {
    root: "/login",
    route: (redirectTo: string | null | undefined) =>
      `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  register: {
    root: "/register",
    route: (redirectTo: string | null | undefined) =>
      `/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  admin: {
    root: "/admin",
    dashboard: {
      root: "dashboard",
      route: () => "/admin/dashboard",
    },
    rbac: {
      root: "rbac",
      roles: {
        list: {
          root: "roles",
          route: () => "/admin/rbac/roles",
        },
        new: {
          root: "new",
          route: () => "/admin/rbac/roles/new",
        },
        permissions : {
          root : ":id/permissions",
          route : (id : string) => `/admin/rbac/roles/${id}/permissions`
        }
      },
    },
    tenants: {
      root: "tenants",
      route: () => "/admin/tenants",
      list: {
        root: "",
        route: () => "/admin/tenants",
      },
      new: {
        root: "new",
        route: () => "/admin/tenants/new",
      },
    },
    users: {
      root: "users",
      route: () => "/admin/users",
      list: {
        root: "",
        route: () => "/admin/users",
      },
      new: {
        root: "new",
        route: () => "/admin/users/new",
      },
    },
  },

  tenant: {
    root: "/",
    dashboard: {
      root: "dashboard",
      route: () => "/dashboard",
    },
    users: {
      root: "users",
      route: () => "/users",
      list: {
        root: "",
        route: () => "/users",
      },
      new: {
        root: "new",
        route: () => "/users/new",
      },
    },
  },
};

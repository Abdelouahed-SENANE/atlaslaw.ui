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
      `/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`,
  },
  register: {
    root: "/register",
    route: (redirectTo: string | null | undefined) =>
      `/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`,
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
        edit: {
          root: ":id/edit",
          route: (id: string) => `/admin/rbac/roles/${id}/edit`,
        },
        permissions: {
          root: ":id/permissions",
          route: (id: string) => `/admin/rbac/roles/${id}/permissions`,
        },
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
      edit: {
        root: ":id/edit",
        route: (id: string) => `/admin/tenants/${id}/edit`,
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
  suspended: {
    root: "/suspended",
    route: () => "/suspended",
  },
  tenant: {
    root: "/",
    dashboard: {
      root: "dashboard",
      route: () => "/dashboard",
    },
    employees: {
      root: "employees",
      route: () => "/employees",
      list: {
        root: "",
        route: () => "/employees",
      },
      new: {
        root: "new",
        route: () => "/employees/new",
      },
      edit: {
        root: ":id/edit",
        route: (id: string) => `/employees/${id}/edit`,
      },
    },
  },
};

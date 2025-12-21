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
    parties: {
      root: "parties",
      route: () => "/parties",
      types: {
        root: "/parties/types",
        route: () => "/parties/types",
      },
      list: {
        root: "",
        route: () => "/parties",
      },
      new: {
        root: "new",
        route: () => "/parties/new",
      },
      edit: {
        root: ":id/edit",
        route: (id: string) => `/parties/${id}/edit`,
      },
    },
    clients: {
      root: "clients",
      route: () => "/clients",
      types: {
        root: "/clients/types",
        route: () => "/clients/types",
      },
      list: {
        root: "",
        route: () => "/clients",
      },
      new: {
        root: "new",
        route: () => "/clients/new",
      },
      edit: {
        root: ":id/edit",
        route: (id: string) => `/clients/${id}/edit`,
      },
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
    roles: {
      root: "roles",
      route: () => "/roles",
      list: {
        root: "",
        route: () => "/roles",
      },
      new: {
        root: "new",
        route: () => "/roles/new",
      },
      edit: {
        root: ":id/edit",
        route: (id: string) => `/roles/${id}/edit`,
      },
      permissions: {
        root: ":id/permissions",
        route: (id: string) => `/roles/${id}/permissions`,
      },
    },
  },
};

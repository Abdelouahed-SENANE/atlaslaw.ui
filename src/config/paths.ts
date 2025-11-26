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
    route: () => "/admin",
    dashboard: {
      root: "dashboard",
      route: () => "dashboard",
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
};

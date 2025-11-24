
export const paths = {
  home: {
    root: "/",
    route: () => "/",
  },
  profile: {
    root: "/profile",
    route: () => "/profile",
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
  admin : {
    root: "/admin",
    route: () => "/admin",
    dashboard : {
      root: "/admin/dashboard",
      route: () => "/admin/dashboard",
    }
  }
};

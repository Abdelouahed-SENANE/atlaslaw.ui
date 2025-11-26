import { toast } from "@/components/ui/toast/use-toast";
import Axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useTokenStore } from "../store/token-store";
import { paths } from "./paths";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const accessToken = useTokenStore.getState().access_token;

  if (config.headers) {
    config.headers.Accept = "application/json";
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.withCredentials = true;
  }

  return config;
}
const API_URL = import.meta.env.VITE_API_URL;

export const api$ = Axios.create({
  baseURL: API_URL,
});

api$.interceptors.request.use(authRequestInterceptor);
const is401 = (e: unknown): e is AxiosError =>
  !!(e as AxiosError)?.response && (e as AxiosError).response!.status === 401;

let redirecting = false;

function redirectToLoginPreservingPath() {
  if (window.location.pathname.startsWith("/login")) return;
  if (redirecting) return;
  redirecting = true;

  const from = window.location.pathname + window.location.search;
  window.location.replace(paths.login.route(from));
}

export function apiErrorHandler(error: any) {
  // Axios network errors
  if (error.code === "ERR_NETWORK") {
    toast({
      title: "Network Error",
      description: "Unable to connect to the server. Please try again.",
      type: "error",
    });
    return;
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    toast({
      title: "Request Timeout",
      description: "The server took too long to respond.",
      type: "error",
    });
    return;
  }

  // API returned JSON error
  const message =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred.";

  toast({
    title: `Error ${error.response?.status || ""}`,
    description: message,
    type: "error",
  });
}

api$.interceptors.response.use(
  (res) => res,
  (err) => {
    // apiErrorHandler(err);
    if (err.code === "ERR_NETWORK") {
      toast({
        title: "Server Offline",
        description: "Cannot reach API server.",
        type: "error",
      });

      return Promise.reject({ ...err, handled: true });
    }

    if (!is401(err)) return Promise.reject(err);
    // if ((err.config?.url || "").toString().includes("/refresh")) {
    //   // treat as unauthenticated below
    // }
    useTokenStore.getState().clearAccessToken();
    redirectToLoginPreservingPath();
    return Promise.reject(err);
  }
);

// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     // useNotifications.getState().addNotification({
//     //   type: 'error',
//     //   title: 'Error',
//     //   message,
//     // });

//     if (error.response?.status === 401) {
//       const searchParams = new URLSearchParams();
//     //   const redirectTo =
//     //     searchParams.get('redirectTo') || window.location.pathname;
//       window.location.href = paths.auth['sign-in'].getLink();
//     }

//     return Promise.reject(error);
//   },
// );

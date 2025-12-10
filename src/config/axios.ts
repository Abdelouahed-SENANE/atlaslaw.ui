import { toast } from "@/components/ui/toast/use-toast";
import Axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
// import { useTokenStore } from "../store/token-store";
import i18n from "./i18n";

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  // const accessToken = useTokenStore.getState().access_token;
  const lang = i18n.language;
  if (config.headers) {
    config.headers.Accept = "application/json";
    config.headers["Accept-Language"] = lang;
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    config.withCredentials = true;
  }

  return config;
}
const API_URL = import.meta.env.VITE_API_URL;

export const api$: AxiosInstance = Axios.create({
  baseURL: API_URL,
});

api$.interceptors.request.use(authRequestInterceptor);
const is401 = (e: unknown): e is AxiosError =>
  !!(e as AxiosError)?.response && (e as AxiosError).response!.status === 401;

// let redirecting = false;

// function redirectToLoginPreservingPath() {
//   if (window.location.pathname.startsWith("/login")) return;
//   if (redirecting) return;
//   redirecting = true;

//   const from = window.location.pathname + window.location.search;
//   window.location.replace(paths.login.route(from));
// }
// let isRedirecting = false;

api$.interceptors.response.use(
  (res) => res,
  (err) => {
    const pathname = window.location.pathname;
    const onLoginPage = pathname.startsWith("/login");

    if (err.code === "ERR_NETWORK") {
      toast({
        title: "Server Offline",
        description: "Cannot reach API server.",
        type: "error",
      });
      return Promise.reject(err);
    }

    if (!is401(err)) return Promise.reject(err);

    // 🚫 DO NOT redirect if already on login page
    if (onLoginPage) {
      return Promise.reject(err);
    }

    // if (!isRedirecting) {
    //   isRedirecting = true;

    //   toast({
    //     title: "Unauthorized",
    //     description: "Your session has expired",
    //     type: "error",
    //   });

    //   window.location.href = paths.login.route(pathname);
    // }

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

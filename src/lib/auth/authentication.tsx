import { api$ } from "@/config/axios";
import { useTokenStore } from "@/store/token-store";
import { ApiResponse, Jwt, User } from "@/types/api";
import { AxiosError } from "axios";
import React from "react";
import { configureAuth } from "react-query-auth";
import { useLocation } from "react-router";
import { z } from "zod";
import { buildAuthLoginRedirect } from "../utils";
import { Redirect } from "@/utils/smooth-redirect";
import { Logger } from "@/utils/logger";

export const loginSchema = z.object({
  email: z
    .email("login.errors.invalid_email")
    .min(1, "login.errors.email_required"), // required
  // invalid format
  password: z
    .string()
    .min(1, "login.errors.password_required")
    .min(8, "login.errors.password_min"), // min length
});

export async function getMe(): Promise<User | null> {
  // const token = useTokenStore.getState().access_token;

  // if (!token) return null;

  try {
    const { data } = await api$.get<ApiResponse<User>>("/me");
    return data.data ?? null;
  } catch (e) {
    const err = e as AxiosError;
    console.error(err);
    if (err.response?.status === 401) {
      useTokenStore.getState().clearAccessToken();
      return null;
    }
    throw e; // non-401 errors bubble
  }
}

const logout = (): Promise<void> => {
  return api$.post("/logout");
};

export type LoginInputs = z.infer<typeof loginSchema>;
const login = async (payload: LoginInputs): Promise<ApiResponse<Jwt>> => {
  const res = await api$.post<ApiResponse<Jwt>>("/login", payload);
  return res.data;
};

// export type RegisterInputs = z.infer<typeof userSchema>;
// export const register = (
//   payload: RegisterInputs
// ): Promise<ApiResponse<Jwt>> => {
//   return api$.post("/register", payload);
// };

const authConfig = {
  userFn: getMe,
  loginFn: async (payload: LoginInputs) => {
    const res = await login(payload);
    const access_token = res?.data?.access_token || "";

    useTokenStore.getState().setAccessToken(access_token);
    const user = await getMe();
    Logger.info(user);

    return user;
  },
  registerFn: async () => {
    // await register(userRequest);
    return null;
  },
  logoutFn: logout,
};
export const { useUser, useLogin, useRegister, useLogout, AuthLoader } =
  configureAuth(authConfig);

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useUser();
  const location = useLocation();
  console.log("user auth ", user.data);

  if (!user.data) {
    return <Redirect to={buildAuthLoginRedirect(location.pathname)} />;
  }

  return children;
};

// export const refresh = async (): Promise<string> => {
//   const { refresh_token } = useTokenStore.getState();

//   if (!refresh_token) {
//     console.warn("❌ No refresh token available");
//     useTokenStore.getState().clearTokens();
//     window.location.href = paths.login.route(window.location.pathname);
//     throw new Error("No refresh token");
//   }

//   try {
//     useTokenStore.getState().setAccessToken({ access_token: "" });

//     const response = await api$.post<ApiResponse<Jwt>>(
//       "/auth/refresh",
//       { refresh_token },
//       { withCredentials: true }
//     );

//     const jwt = response.data.data!;

//     useTokenStore.getState().setTokens({
//       access_token: jwt.access_token,
//       refresh_token: jwt.refresh_token,
//       expires_in: jwt.expires_in,
//     });

//     // scheduleRefresh(jwt.expires_in);

//     return jwt.access_token;
//   } catch (err) {
//     console.error("❌ Token refresh failed", err);
//     useTokenStore.getState().clearTokens();
//     window.location.href = paths.login.route("");
//     throw err;
//   }
// };

// let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

// export const scheduleRefresh  = (expiredIn: number) => {
//   if (refreshTimeoutId) clearTimeout(refreshTimeoutId);

//   const refreshDelay = Math.max((expiredIn - 30) * 1000, 0);
//   console.info(
//     "🔄 Token will refresh at:",
//     new Date(Date.now() + refreshDelay).toLocaleString()
//   );

//   refreshTimeoutId = setTimeout(async () => {
//     try {
//       await refresh();
//     } catch (error: any) {
//       console.error("Token refresh failed ", error.message);
//       if (refreshTimeoutId) {
//         clearTimeout(refreshTimeoutId);
//         refreshTimeoutId = null;
//       }
//       useTokenStore.getState().clearTokens();
//       window.location.href = paths.login.route('');
//     }
//   }, refreshDelay);
// }

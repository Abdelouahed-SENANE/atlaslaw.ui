import { Spinner } from "@/components/ui/spinner";
import { api$ } from "@/config/axios";
import { paths } from "@/config/paths";
import { User } from "@/features/user/types";
import { ApiResponse, Jwt } from "@/types/api";
import { Logger } from "@/utils/logger";
import { AxiosError } from "axios";
import React from "react";
import { configureAuth } from "react-query-auth";
import { Navigate, useLocation } from "react-router";
import { z } from "zod";
import { normalizeToE164 } from "../utils";

export const loginSchema = z.object({
  email: z
    .email("user.email.errors.invalid")
    .min(1, "user.email.errors.required"), // required
  password: z
    .string()
    .min(1, "user.password.errors.required")
    .min(8, "user.password.errors.min"), // min length
});

export const AUTH_KEY = "authenticated-user";

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api$.get<ApiResponse<User>>("/me");
    return data.data ?? null;
  } catch (e) {
    const err = e as AxiosError;
    console.error(err.message.toString());
    if (err.response?.status === 401) {
      return null;
    }
    throw e;
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

export const createTranslationSchema = (key?: string) => {
  return z.object({
    ar: z.string().min(1, `${key}.ar`),
    fr: z.string().min(1, `${key}.fr`),
  });
};

export const registerSchema = z.object({
  name: createTranslationSchema("user.name.errors"),
  email: z
    .email("user.email.errors.invalid")
    .min(1, "user.email.errors.required"), // required
  password: z
    .string()
    .min(1, "user.password.errors.required")
    .min(8, "user.password.errors.min"),
  phone: z
    .string()
    .optional()
    .transform((value) => normalizeToE164(value || "", "+212"))
    .refine(
      (value) => !value || /^\+[1-9]\d{7,14}$/.test(value),
      "user.phone.errors.invalid",
    ),
});

export type RegisterInputs = z.infer<typeof registerSchema>;
export const register = (
  payload: RegisterInputs,
): Promise<ApiResponse<User>> => {
  return api$.post("/register", payload);
};

const authConfig = {
  userFn: getMe,
  loginFn: async (payload: LoginInputs) => {
    await login(payload);
    const user = await getMe();
    Logger.info("User logged in", user);
    return user;
  },
  registerFn: async (payload: RegisterInputs) => {
    await register(payload);
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
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to={paths.login.route(location.pathname)} replace />;
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

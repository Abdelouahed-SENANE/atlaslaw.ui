import { env } from "@/config/env";

// src/utils/logger.ts
const isDev = env.logging.mode === "dev";

export const Logger = {
   info: (...args: any[]) => {
    if (isDev) console.info("[INFO]", ...args);
  },
  log: (...args: any[]) => {
    if (isDev) console.log("[LOG]", ...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn("[WARN]", ...args);
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
  },
};

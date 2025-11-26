import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildAuthLoginRedirect(path: string) {
  return `https://auth.localhost:3000/login?redirectTo=${encodeURIComponent(path)}`;
}


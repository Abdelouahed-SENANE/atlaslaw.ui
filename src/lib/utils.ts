import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeToE164 = (value: string, defaultCountryCode = "+212") => {
  if (!value) return value;

  value = value.replace(/[\s\-()]/g, "");

  if (value.startsWith("+") && /^\+[1-9]\d{7,14}$/.test(value)) {
    return value;
  }

  if (value.startsWith("0")) {
    return defaultCountryCode + value.slice(1);
  }

  if (/^\d{8,14}$/.test(value)) {
    return defaultCountryCode + value;
  }

  return value;
};

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

export function diffObject<T extends Record<string, any>>(
  oldObj: T,
  newObj: Partial<T>,
): Partial<T> {
  const result: Partial<T> = {};

  (Object.keys(newObj) as (keyof T)[]).forEach((key) => {
    if (newObj[key] !== oldObj[key]) {
      result[key] = newObj[key];
    }
  });

  return result;
}
export const toDate = (
  value: string | Date | undefined | null,
): Date | undefined => {
  if (!value) return undefined; // ⬅ safe
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
}

export function normalizeFilesErrors(error: any): string[] {
  if (!error) return [];

  const messages: string[] = [];

  if (error.message) {
    messages.push(String(error.message));
  }

  // 2️⃣ Multiple errors (criteriaMode: "all")
  if (error.types) {
    Object.values(error.types).forEach((value) => {
      if (Array.isArray(value)) {
        messages.push(...value.map(String));
      } else {
        messages.push(String(value));
      }
    });
  }

  if (Array.isArray(error)) {
    error.forEach((item) => {
      if (item?.message) {
        messages.push(String(item.message));
      }
    });
  }

  return Array.from(new Set(messages));
}

export function toDateOnly(value: Date | string) {
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

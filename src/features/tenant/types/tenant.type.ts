import { User } from "@/features/user/types";
import { Entity } from "@/types/api";

export type Settings = {
  locale: string;
  timezone: string;
};
export enum TenantStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
}
export type Tenant = Entity<{
  name: string;
  slug: string;
  status: TenantStatus;
  owner: User;
  settings?: Settings;
}>;

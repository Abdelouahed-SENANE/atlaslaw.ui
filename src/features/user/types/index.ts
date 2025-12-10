import { Tenant } from "@/features/tenant/types";
import { PermissionCode, Scope } from "@/lib/authorization";
import { BaseOption, Entity, Translation } from "@/types/api";

export interface UserOption extends BaseOption {
  email: string;
}
export type User = Entity<{
  email: string;
  name: Translation;
  scope: Scope;
  permissions: PermissionCode[];
  tenant?: Partial<Tenant>;
}>;

export type UserRole = {
  id: string;
  name: string;
  assigned?: boolean;
};

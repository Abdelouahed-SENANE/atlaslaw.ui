import { Permission } from "@/features/rbac/types";
import { Scope } from "@/lib/authorization";
import { BaseOption, Entity, Translation } from "@/types/api";

export interface UserOption extends BaseOption {
  email: string;
}
export type User = Entity<{
  email: string;
  name: Translation;
  scope: Scope;
  permissions: Permission[];
}>;

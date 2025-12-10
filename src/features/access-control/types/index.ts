import { Entity } from "@/types/api";

export type Role = Entity<{
  tenantID?: string;
  name: string;
  description: string;
}>;

export type Permission = {
  id: string;
  code: string;
  description: string;
  assigned: boolean;
};

export type RolePermission = {
  role: Partial<Role>;
  groups: Record<string, Permission[]>;
};


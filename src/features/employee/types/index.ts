import { User } from "@/features/user/types";
import { Entity } from "@/types/api";

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export type Employee = Entity<{
  job_title: string;
  work_phone: string;
  hiring_date: Date;
  status: EmployeeStatus;
  user?: User;
}>;

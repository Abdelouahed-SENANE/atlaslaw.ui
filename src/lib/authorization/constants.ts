export enum Scope {
  SYSTEM = "system",
  TENANT = "tenant",
}

export enum PermissionCode {
  // TENANTS (Super Admin)
  LIST_TENANTS = "list:tenants",
  CREATE_TENANTS = "create:tenants",
  UPDATE_TENANTS = "update:tenants",
  DELETE_TENANTS = "delete:tenants",

  // USERS
  LIST_USERS = "list:users",
  UPDATE_USERS = "update:users",
  CREATE_USERS = "create:users",
  DELETE_USERS = "delete:users",

  // EMPLOYEES
  LIST_EMPLOYEES = "list:employees",
  VIEW_EMPLOYEES = "view:employees",
  UPDATE_EMPLOYEES = "update:employees",
  CREATE_EMPLOYEES = "create:employees",
  DELETE_EMPLOYEES = "delete:employees",

  // PARTY TYPES
  LIST_PARTY_TYPES = "list:party-types",
  VIEW_PARTY_TYPES = "view:party-types",
  UPDATE_PARTY_TYPES = "update:party-types",
  CREATE_PARTY_TYPES = "create:party-types",
  DELETE_PARTY_TYPES = "delete:party-types",

  // ROLES
  LIST_ROLES = "list:roles",
  CREATE_ROLES = "create:roles",
  UPDATE_ROLES = "update:roles",
  DELETE_ROLES = "delete:roles",
  VIEW_ROLES = "view:roles",

  // CASES (Law Firm)
  LIST_CASES = "list:cases",
  VIEW_CASE = "view:cases",
  CREATE_CASE = "create:cases",
  UPDATE_CASE = "update:cases",
  DELETE_CASE = "delete:cases",

  // CLIENTS
  LIST_CLIENTS = "list:clients",
  VIEW_CLIENTS = "view:clients",
  CREATE_CLIENTS = "create:clients",
  UPDATE_CLIENTS = "update:clients",
  DELETE_CLIENTS = "delete:clients",

  // OPPONENTS
  LIST_OPPONENTS = "list:opponents",
  VIEW_OPPONENTS = "view:opponents",
  CREATE_OPPONENTS = "create:opponents",
  UPDATE_OPPONENTS = "update:opponents",
  DELETE_OPPONENTS = "delete:opponents",

  // FILES
  LIST_FILES = "list:files",
  UPLOAD_FILES = "upload:files",
  DELETE_FILES = "delete:files",
  DOWNLOAD_FILES = "download:files",

  // PROCEDURES
  LIST_PROCEDURES = "list:procedures",
  VIEW_PROCEDURES = "view:procedures",
  CREATE_PROCEDURES = "create:procedures",
  UPDATE_PROCEDURES = "update:procedures",
  DELETE_PROCEDURES = "delete:procedures",

  // HEARINGS
  LIST_HEARINGS = "list:hearings",
  VIEW_HEARINGS = "view:hearings",
  CREATE_HEARINGS = "create:hearings",
  UPDATE_HEARINGS = "update:hearings",
  DELETE_HEARINGS = "delete:hearings",
}

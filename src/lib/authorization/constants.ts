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

  // USERS
  LIST_EMPLOYEES = "list:employees",
  UPDATE_EMPLOYEES = "update:employees",
  CREATE_EMPLOYEES = "create:employees",
  DELETE_EMPLOYEES = "delete:employees",
  // ROLES
  LIST_ROLES = "list:roles",
  CREATE_ROLES = "create:roles",
  UPDATE_ROLES = "update:roles",
  DELETE_ROLES = "delete:roles",

  // CASES (Law Firm)
  LIST_CASES = "list:cases",
  VIEW_CASE = "view:case",
  CREATE_CASE = "create:case",
  UPDATE_CASE = "update:case",
  DELETE_CASE = "delete:case",
  CLOSE_CASE = "close:case",

  // CLIENTS
  LIST_CLIENTS = "list:clients",
  VIEW_CLIENT = "view:client",
  CREATE_CLIENT = "create:client",
  UPDATE_CLIENT = "update:client",
  DELETE_CLIENT = "delete:client",

  // DOCUMENTS
  LIST_DOCUMENTS = "list:documents",
  UPLOAD_DOCUMENT = "upload:document",
  DELETE_DOCUMENT = "delete:document",
  DOWNLOAD_DOCUMENT = "download:document",
}

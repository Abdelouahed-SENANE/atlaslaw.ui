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

  // CLIENTS TYPES
  LIST_CLIENT_TYPES = "list:client-types",
  VIEW_CLIENT_TYPES = "view:client-types",
  UPDATE_CLIENT_TYPES = "update:client-types",
  CREATE_CLIENT_TYPES = "create:client-types",
  DELETE_CLIENT_TYPES = "delete:client-types",

  // ROLES
  LIST_ROLES = "list:roles",
  CREATE_ROLES = "create:roles",
  UPDATE_ROLES = "update:roles",
  DELETE_ROLES = "delete:roles",
  VIEW_ROLES = "view:roles",

  // CASES (Law Firm)
  LIST_CASES = "list:cases",
  VIEW_CASE = "view:case",
  CREATE_CASE = "create:case",
  UPDATE_CASE = "update:case",
  DELETE_CASE = "delete:case",
  CLOSE_CASE = "close:case",

  // CLIENTS
  LIST_CLIENTS = "list:clients",
  VIEW_CLIENTS = "view:clients",
  CREATE_CLIENTS = "create:clients",
  UPDATE_CLIENTS = "update:clients",
  DELETE_CLIENTS = "delete:clients",

  // DOCUMENTS
  LIST_DOCUMENTS = "list:documents",
  UPLOAD_DOCUMENT = "upload:document",
  DELETE_DOCUMENT = "delete:document",
  DOWNLOAD_DOCUMENT = "download:document",
}

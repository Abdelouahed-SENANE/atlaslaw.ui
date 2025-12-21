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

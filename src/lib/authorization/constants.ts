export enum Scope {
  SYSTEM = "system",
  TENANT = "tenant",
}

export enum Permission {
  // TENANTS (Super Admin)
  LIST_TENANTS = "list:tenants",
  CREATE_TENANT = "create:tenant",
  UPDATE_TENANT = "update:tenant",
  DELETE_TENANT = "delete:tenant",

  // USERS
  LIST_USERS = "list:users",
  VIEW_USER = "view:user",
  CREATE_USER = "create:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",

  // ROLES
  LIST_ROLES = "list:roles",
  CREATE_ROLE = "create:role",
  UPDATE_ROLE = "update:role",
  DELETE_ROLE = "delete:role",

  // PERMISSIONS
  LIST_PERMISSIONS = "list:permissions",
  ASSIGN_PERMISSION = "assign:permission",
  REMOVE_PERMISSION = "remove:permission",

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

  // BILLING
  LIST_INVOICES = "list:invoices",
  VIEW_INVOICE = "view:invoice",
  CREATE_INVOICE = "create:invoice",
  UPDATE_INVOICE = "update:invoice",
  DELETE_INVOICE = "delete:invoice",
  PAY_INVOICE = "pay:invoice",
}

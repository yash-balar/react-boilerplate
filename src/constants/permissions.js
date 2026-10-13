export const ROLES = Object.freeze({
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
});

export const PERMISSIONS = Object.freeze({
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_MANAGERS: "view_managers",
  CREATE_MANAGER: "create_manager",
  UPDATE_MANAGER: "update_manager",
  DELETE_MANAGER: "delete_manager",
  VIEW_PROFILE: "view_profile",
  UPDATE_PROFILE: "update_profile",
});

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MANAGERS,
    PERMISSIONS.CREATE_MANAGER,
    PERMISSIONS.UPDATE_MANAGER,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
  ],
});

export const can = (user, permission) =>
  ROLE_PERMISSIONS[user?.role]?.includes(permission) ?? false;

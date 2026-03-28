export type Role = "owner" | "admin" | "member" | "guest";

const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  guest: 1,
};

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canEditBoard(role: Role): boolean {
  return hasPermission(role, "member");
}

export function canManageTeam(role: Role): boolean {
  return hasPermission(role, "admin");
}

export function canInviteMembers(role: Role): boolean {
  return hasPermission(role, "admin");
}

export function canDeleteTeam(role: Role): boolean {
  return role === "owner";
}

export function canManageRoles(role: Role): boolean {
  return hasPermission(role, "owner");
}

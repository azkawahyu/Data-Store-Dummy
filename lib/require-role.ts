interface User {
  username: string;
  role: string;
}

export function requireRole(user: User, roles: string[]) {
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}

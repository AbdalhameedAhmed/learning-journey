import { UserRole } from "@schemas/User";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.PRO) return "/";
  else if (role === UserRole.ADMIN) return "/admin/dashboard";
  else return "/";
};

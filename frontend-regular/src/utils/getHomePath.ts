import { UserRole } from "@schemas/User";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.REGULAR) return "/home";
  else if (role === UserRole.ADMIN) return "/admin/dashboard";
  else return "/";
};

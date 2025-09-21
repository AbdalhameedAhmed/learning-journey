import { UserRole } from "@schemas/User";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.ADMIN) return "/";
  else if (role === UserRole.PRO) return "/";
  else return "/";
};

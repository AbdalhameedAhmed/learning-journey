import { UserRole } from "@schemas/User";

export const getHomePath = (role: UserRole): string => {
  if (role === UserRole.ADMIN) return "/";
  else if (role === UserRole.REGULAR) return "/";
  else return "/";
};

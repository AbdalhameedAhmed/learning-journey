export enum UserRole {
  REGULAR = "regular",
  PRO = "pro",
  ADMIN = "admin",
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

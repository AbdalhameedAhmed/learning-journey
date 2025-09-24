// frontend-pro/src/schemas/auth.ts

import type { IUser, UserRole } from "./User";

// Login request body
export interface UserLogin {
  email: string;
  password: string;
}

// Registration request body
export interface UserRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: UserRole;
}

// Token structure
export interface Token {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

// Login response
export interface LoginResponse {
  tokens: Token;
}

// Registration response
export interface RegisterResponse {
  user: IUser;
  tokens?: Token;
}

// Current logged-in user response
export type CurrentUser = IUser; 

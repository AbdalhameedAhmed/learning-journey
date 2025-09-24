// frontend-pro/src/services/auth.ts
import apiReq from "@/services/apiReq";
import type {
  UserLogin,
  UserRegister,
  LoginResponse,
  RegisterResponse,
  CurrentUser, //import CurrentUser type
} from "@schemas/auth";

/**
 * Handles user login by making a POST request to the backend.
 * @param data - The user's login credentials (email and password).
 * @returns A promise that resolves with the access and refresh tokens.
 */
export const loginUser = async (data: UserLogin): Promise<LoginResponse> => {
  return await apiReq("POST", "/auth/login", data);
};

/**
 * Handles new user registration by making a POST request to the backend.
 * @param data - The new user's registration details.
 * @returns A promise that resolves with the new user's data and optional tokens.
 */
export const registerUser = async (
  data: UserRegister
): Promise<RegisterResponse> => {
  return await apiReq("POST", "/auth/register", data);
};

/**
 * Fetches the current logged-in user details using the stored access token.
 * @returns A promise that resolves with the user details.
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  return await apiReq("GET", "/auth/me");
};
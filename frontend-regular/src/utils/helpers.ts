import type { Tokens } from "@schemas/Tokens";

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const;

export const getTokens = (): Tokens => {
  try {
    return {
      accessToken: localStorage.getItem(STORAGE_KEYS.accessToken),
      refreshToken: localStorage.getItem(STORAGE_KEYS.refreshToken),
    };
  } catch (error) {
    console.error("Error retrieving tokens from localStorage:", error);
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};

export const removeTokens = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  } catch (error) {
    console.error("Error removing tokens from localStorage:", error);
  }
};

export const setAccessToken = (accessToken: string): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    return true;
  } catch (error) {
    console.error("Error setting access token in localStorage:", error);
    return false;
  }
};

export const setRefreshToken = (refreshToken: string): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    return true;
  } catch (error) {
    console.error("Error setting refresh token in localStorage:", error);
    return false;
  }
};

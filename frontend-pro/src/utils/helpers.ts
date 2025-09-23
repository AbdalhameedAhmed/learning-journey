import type { Settings } from "@schemas/Settings";
import type { Tokens } from "@schemas/Tokens";

export const STORAGE_KEYS = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  settings: "settings",
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

/* Settings */
export const getSettingsStorage = (): Settings | null => {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.settings);
    if (serializedSettings === null) {
      return null;
    }

    const settings = JSON.parse(serializedSettings) as Settings;

    if (typeof settings === "object" && settings !== null) {
      return settings;
    }

    console.warn("Invalid settings format found in localStorage");
    return null;
  } catch (error) {
    console.error("Error retrieving settings from localStorage:", error);
    return null;
  }
};

export const setSettingsStorage = (settings: Settings): boolean => {
  try {
    if (typeof settings !== "object" || settings === null) {
      console.error("Invalid settings object provided");
      return false;
    }

    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEYS.settings, serializedSettings);
    return true;
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
    return false;
  }
};

export const deleteSettingsStorage = () => {
  try {
    localStorage.removeItem("settings");
  } catch (error) {
    console.error("Error deleting settings from localStorage:", error);
  }
};

export const clearAllAppData = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.settings);
    return true;
  } catch (error) {
    console.error("Error clearing all app data from localStorage:", error);
    return false;
  }
};

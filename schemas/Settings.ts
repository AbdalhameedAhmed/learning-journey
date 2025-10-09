export type FontSize = "small" | "medium" | "large";

export interface Settings {
  primaryColor: string;
  darkPrimaryColor: string;
  textColor: string;
  darkTextColor: string;
  fontSize: FontSize;
  theme: "light" | "dark";
}
